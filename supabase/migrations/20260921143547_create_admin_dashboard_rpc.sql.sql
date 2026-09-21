CREATE OR REPLACE FUNCTION public.get_admin_dashboard()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now timestamp;
  v_this_month_start timestamp;
  v_last_month_start timestamp;
  v_current_year integer;
  v_result jsonb;
BEGIN
  -- Use the store's timezone for reporting boundaries.
  v_now := CURRENT_TIMESTAMP AT TIME ZONE 'Africa/Lagos';

  v_this_month_start :=
    date_trunc('month', v_now);

  v_last_month_start :=
    v_this_month_start - INTERVAL '1 month';

  v_current_year :=
    EXTRACT(YEAR FROM v_now)::integer;

  -- Build the complete dashboard response.
  SELECT jsonb_build_object(

    -- Calculate total sales from paid, non-deleted orders.
    'totalSales',
    (
      SELECT COALESCE(
        SUM(COALESCE(o.total, 0)),
        0
      )
      FROM public.orders o
      WHERE o.status = 'paid'
        AND o.is_deleted = false
    ),

    -- Calculate total paid orders.
    'totalOrders',
    (
      SELECT COUNT(*)
      FROM public.orders o
      WHERE o.status = 'paid'
        AND o.is_deleted = false
    ),

    -- Calculate total customers.
    'totalCustomers',
    (
      SELECT COUNT(*)
      FROM public.users
    ),

    -- Calculate sales percentage change from the previous month.
    'salesTrend',
    (
      SELECT
        CASE
          WHEN previous_sales = 0 THEN NULL
          ELSE ROUND(
            (
              (current_sales - previous_sales)
              / previous_sales
            ) * 100
          )::integer
        END
      FROM (
        SELECT
          COALESCE(
            SUM(
              CASE
                WHEN o.created_at >= v_this_month_start
                THEN COALESCE(o.total, 0)
                ELSE 0
              END
            ),
            0
          ) AS current_sales,

          COALESCE(
            SUM(
              CASE
                WHEN o.created_at >= v_last_month_start
                 AND o.created_at < v_this_month_start
                THEN COALESCE(o.total, 0)
                ELSE 0
              END
            ),
            0
          ) AS previous_sales
        FROM public.orders o
        WHERE o.status = 'paid'
          AND o.is_deleted = false
      ) monthly_sales
    ),

    -- Calculate order percentage change from the previous month.
    'ordersTrend',
    (
      SELECT
        CASE
          WHEN previous_orders = 0 THEN NULL
          ELSE ROUND(
            (
              (
                current_orders::numeric
                - previous_orders::numeric
              )
              / previous_orders::numeric
            ) * 100
          )::integer
        END
      FROM (
        SELECT
          COUNT(*) FILTER (
            WHERE o.created_at >= v_this_month_start
          ) AS current_orders,

          COUNT(*) FILTER (
            WHERE o.created_at >= v_last_month_start
              AND o.created_at < v_this_month_start
          ) AS previous_orders
        FROM public.orders o
        WHERE o.status = 'paid'
          AND o.is_deleted = false
      ) monthly_orders
    ),

    -- Calculate customer percentage change from the previous month.
    'customersTrend',
    (
      SELECT
        CASE
          WHEN previous_customers = 0 THEN NULL
          ELSE ROUND(
            (
              (
                current_customers::numeric
                - previous_customers::numeric
              )
              / previous_customers::numeric
            ) * 100
          )::integer
        END
      FROM (
        SELECT
          COUNT(*) FILTER (
            WHERE u.created_at >= v_this_month_start
          ) AS current_customers,

          COUNT(*) FILTER (
            WHERE u.created_at >= v_last_month_start
              AND u.created_at < v_this_month_start
          ) AS previous_customers
        FROM public.users u
      ) monthly_customers
    ),

    -- Return all twelve months of the store's current reporting year.
    'monthlyData',
    (
      SELECT COALESCE(
        jsonb_agg(
          jsonb_build_object(
            'month',
            month_name,
            'value',
            revenue
          )
          ORDER BY month_number
        ),
        '[]'::jsonb
      )
      FROM (
        SELECT
          months.month_number,

          TO_CHAR(
            MAKE_DATE(
              v_current_year,
              months.month_number,
              1
            ),
            'FMMonth'
          ) AS month_name,

          COALESCE(
            SUM(
              CASE
                WHEN EXTRACT(
                  MONTH FROM o.created_at
                ) = months.month_number
                THEN COALESCE(o.total, 0)
                ELSE 0
              END
            ),
            0
          ) AS revenue

        FROM generate_series(
          1,
          12
        ) AS months(month_number)

        LEFT JOIN public.orders o
          ON o.status = 'paid'
         AND o.is_deleted = false
         AND EXTRACT(
               YEAR FROM o.created_at
             ) = v_current_year

        GROUP BY
          months.month_number

        ORDER BY
          months.month_number
      ) monthly
    ),

    -- Return the seven products with the highest quantity sold.
    'orderRanking',
    (
      SELECT COALESCE(
        jsonb_agg(
          jsonb_build_object(
            'product',
            product,
            'total',
            total
          )
          ORDER BY total DESC, product ASC
        ),
        '[]'::jsonb
      )
      FROM (
        SELECT
          COALESCE(
            NULLIF(item->>'itemName', ''),
            'Unknown Product'
          ) AS product,

          SUM(
            COALESCE(
              NULLIF(item->>'quantity', '')::numeric,
              1
            )
          )::integer AS total

        FROM public.orders o

        CROSS JOIN LATERAL jsonb_array_elements(
          CASE
            WHEN jsonb_typeof(o.items::jsonb) = 'array'
            THEN o.items::jsonb
            ELSE '[]'::jsonb
          END
        ) AS item

        WHERE o.status = 'paid'
          AND o.is_deleted = false

        GROUP BY
          COALESCE(
            NULLIF(item->>'itemName', ''),
            'Unknown Product'
          )

        ORDER BY
          total DESC,
          product ASC

        LIMIT 7
      ) ranked_products
    )

  )
  INTO v_result;

  RETURN v_result;
END;
$$;

-- Prevent direct access to the dashboard RPC.
REVOKE ALL
ON FUNCTION public.get_admin_dashboard()
FROM PUBLIC;

REVOKE ALL
ON FUNCTION public.get_admin_dashboard()
FROM anon;

REVOKE ALL
ON FUNCTION public.get_admin_dashboard()
FROM authenticated;