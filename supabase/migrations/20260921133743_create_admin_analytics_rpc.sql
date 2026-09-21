CREATE OR REPLACE FUNCTION public.get_admin_analytics(
  p_range text DEFAULT 'month'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cutoff timestamp;
  v_result jsonb;
BEGIN
  -- Determine the beginning of the requested time range.
  IF p_range = 'today' THEN
    v_cutoff :=
      (CURRENT_TIMESTAMP AT TIME ZONE 'Africa/Lagos')::date;

  ELSIF p_range = 'week' THEN
    v_cutoff :=
      CURRENT_TIMESTAMP AT TIME ZONE 'Africa/Lagos'
      - INTERVAL '7 days';

  ELSIF p_range = 'month' THEN
    v_cutoff :=
      CURRENT_TIMESTAMP AT TIME ZONE 'Africa/Lagos'
      - INTERVAL '1 month';

  ELSIF p_range = 'year' THEN
    v_cutoff :=
      CURRENT_TIMESTAMP AT TIME ZONE 'Africa/Lagos'
      - INTERVAL '1 year';

  ELSIF p_range = 'all' THEN
    v_cutoff := NULL;

  ELSE
    RAISE EXCEPTION 'Invalid analytics range: %', p_range;
  END IF;


  -- Build the complete analytics response.
  SELECT jsonb_build_object(

    -- Overall analytics statistics.
    'stats',
    jsonb_build_object(

      'totalOrders',
      (
        SELECT COUNT(*)
        FROM public.orders o
        WHERE o.is_deleted = false
          AND (
            v_cutoff IS NULL
            OR o.created_at >= v_cutoff
          )
      ),

      'totalRevenue',
      (
        SELECT COALESCE(
          SUM(COALESCE(o.total, 0)),
          0
        )
        FROM public.orders o
        WHERE o.is_deleted = false
          AND (
            v_cutoff IS NULL
            OR o.created_at >= v_cutoff
          )
      ),

      'totalCustomers',
      (
        SELECT COUNT(*)
        FROM public.users u
        WHERE
          v_cutoff IS NULL
          OR u.created_at >= v_cutoff
      ),

      'totalRefunds',
      (
        SELECT COUNT(*)
        FROM public.refunds r
        WHERE
          v_cutoff IS NULL
          OR r.created_at >= v_cutoff
      )
    ),


    -- Sales grouped by product category.
    'salesByCategory',
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'category', category,
            'revenue', revenue,
            'value',
              CASE
                WHEN total_revenue > 0 THEN
                  ROUND(
                    (revenue / total_revenue) * 100
                  )
                ELSE 0
              END
          )
          ORDER BY revenue DESC
        )
        FROM (
          SELECT
            category,
            SUM(revenue) AS revenue,
            SUM(SUM(revenue)) OVER () AS total_revenue
          FROM (
            SELECT
              CASE
                WHEN LOWER(COALESCE(item->>'itemName', '')) LIKE '%shirt%'
                  OR LOWER(COALESCE(item->>'itemName', '')) LIKE '%t-shirt%'
                  OR LOWER(COALESCE(item->>'itemName', '')) LIKE '%top%'
                THEN 'Shirts'

                WHEN LOWER(COALESCE(item->>'itemName', '')) LIKE '%trouser%'
                  OR LOWER(COALESCE(item->>'itemName', '')) LIKE '%pant%'
                  OR LOWER(COALESCE(item->>'itemName', '')) LIKE '%jean%'
                THEN 'Trousers'

                WHEN LOWER(COALESCE(item->>'itemName', '')) LIKE '%shoe%'
                  OR LOWER(COALESCE(item->>'itemName', '')) LIKE '%sneaker%'
                  OR LOWER(COALESCE(item->>'itemName', '')) LIKE '%air force%'
                  OR LOWER(COALESCE(item->>'itemName', '')) LIKE '%boot%'
                THEN 'Shoes'

                WHEN LOWER(COALESCE(item->>'itemName', '')) LIKE '%sofa%'
                  OR LOWER(COALESCE(item->>'itemName', '')) LIKE '%furniture%'
                  OR LOWER(COALESCE(item->>'itemName', '')) LIKE '%chair%'
                  OR LOWER(COALESCE(item->>'itemName', '')) LIKE '%table%'
                THEN 'Furniture'

                WHEN LOWER(COALESCE(item->>'itemName', '')) LIKE '%bag%'
                  OR LOWER(COALESCE(item->>'itemName', '')) LIKE '%watch%'
                  OR LOWER(COALESCE(item->>'itemName', '')) LIKE '%belt%'
                  OR LOWER(COALESCE(item->>'itemName', '')) LIKE '%cap%'
                THEN 'Accessories'

                ELSE 'Other'
              END AS category,

              COALESCE(
                NULLIF(item->>'price', '')::numeric,
                0
              )
              *
              COALESCE(
                NULLIF(item->>'quantity', '')::numeric,
                0
              ) AS revenue

            FROM public.orders o
            CROSS JOIN LATERAL jsonb_array_elements(
              CASE
                WHEN jsonb_typeof(o.items::jsonb) = 'array'
                THEN o.items::jsonb
                ELSE '[]'::jsonb
              END
            ) AS item

            WHERE o.is_deleted = false
              AND (
                v_cutoff IS NULL
                OR o.created_at >= v_cutoff
              )
          ) category_items
          GROUP BY category
        ) category_totals
      ),
      '[]'::jsonb
    ),


    -- Top five products by revenue.
    'topProducts',
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'name', name,
            'sales', sales,
            'revenue', revenue
          )
          ORDER BY revenue DESC
        )
        FROM (
          SELECT
            COALESCE(
              NULLIF(item->>'itemName', ''),
              'Unknown Product'
            ) AS name,

            SUM(
              COALESCE(
                NULLIF(item->>'quantity', '')::numeric,
                0
              )
            ) AS sales,

            SUM(
              COALESCE(
                NULLIF(item->>'price', '')::numeric,
                0
              )
              *
              COALESCE(
                NULLIF(item->>'quantity', '')::numeric,
                0
              )
            ) AS revenue

          FROM public.orders o

          CROSS JOIN LATERAL jsonb_array_elements(
            CASE
              WHEN jsonb_typeof(o.items::jsonb) = 'array'
              THEN o.items::jsonb
              ELSE '[]'::jsonb
            END
          ) AS item

          WHERE o.is_deleted = false
            AND (
              v_cutoff IS NULL
              OR o.created_at >= v_cutoff
            )

          GROUP BY
            COALESCE(
              NULLIF(item->>'itemName', ''),
              'Unknown Product'
            )

          ORDER BY revenue DESC
          LIMIT 5
        ) products
      ),
      '[]'::jsonb
    ),


    -- Sales grouped by customer country.
    'salesByRegion',
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'region', region,
            'revenue', revenue,
            'percentage',
              CASE
                WHEN total_revenue > 0 THEN
                  ROUND(
                    (revenue / total_revenue) * 100
                  )
                ELSE 0
              END
          )
          ORDER BY revenue DESC
        )
        FROM (
          SELECT
            region,
            SUM(revenue) AS revenue,
            SUM(SUM(revenue)) OVER () AS total_revenue

          FROM (
            SELECT
              COALESCE(
                NULLIF(
                  o.shipping_address::jsonb ->> 'country',
                  ''
                ),
                'Other'
              ) AS region,

              COALESCE(o.total, 0) AS revenue

            FROM public.orders o

            WHERE o.is_deleted = false
              AND (
                v_cutoff IS NULL
                OR o.created_at >= v_cutoff
              )
          ) regional_orders

          GROUP BY region
        ) regional_totals
      ),
      '[]'::jsonb
    )

  )
  INTO v_result;


  RETURN v_result;
END;
$$;


-- Don't expose the analytics RPC to anonymous or authenticated clients.
REVOKE ALL
ON FUNCTION public.get_admin_analytics(text)
FROM PUBLIC;

REVOKE ALL
ON FUNCTION public.get_admin_analytics(text)
FROM anon;

REVOKE ALL
ON FUNCTION public.get_admin_analytics(text)
FROM authenticated;