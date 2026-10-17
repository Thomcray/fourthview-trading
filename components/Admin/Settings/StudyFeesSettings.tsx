"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { formatUSD, type StudyPricing } from "@/app/_lib/study-pricing";

type FormState = {
  applicationFee: string;
  scholarshipBalance: string;
  selfSponsorBalance: string;
};

export default function StudyFeesSettings() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<FormState>({
    applicationFee: "",
    scholarshipBalance: "",
    selfSponsorBalance: "",
  });

  const { data, isLoading, isError, refetch } = useQuery<StudyPricing>({
    queryKey: ["adminStudyPricing"],
    queryFn: async () => {
      const res = await fetch("/api/admin/study-pricing");
      if (!res.ok) throw new Error("Failed to load pricing");
      return res.json();
    },
  });

  useEffect(() => {
    if (!data) return;

    setForm({
      applicationFee: String(data.applicationFee),
      scholarshipBalance: String(data.scholarshipBalance),
      selfSponsorBalance: String(data.selfSponsorBalance),
    });
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/study-pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationFee: Number(form.applicationFee),
          scholarshipBalance: Number(form.scholarshipBalance),
          selfSponsorBalance: Number(form.selfSponsorBalance),
        }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error ?? "Failed to save");

      return result;
    },
    onSuccess: () => {
      toast.success("Study fees updated");
      queryClient.invalidateQueries({ queryKey: ["adminStudyPricing"] });
      queryClient.invalidateQueries({ queryKey: ["studyPricing"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />;
  }

  if (isError) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-600">
          Study fees could not be loaded. Check that the study_pricing table
          exists and has its one row.
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const fee = Number(form.applicationFee) || 0;
  const sch = Number(form.scholarshipBalance) || 0;
  const self = Number(form.selfSponsorBalance) || 0;

  const field = (key: keyof FormState, label: string, hint?: string) => (
    <div>
      <Label className="text-gray-700">{label}</Label>

      <div className="relative mt-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          $
        </span>

        <Input
          type="number"
          min={0}
          step={1}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="pl-7"
        />
      </div>

      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Study in China Fees
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Shown on the application form and in admin emails. Changes apply to
          new applications only. Existing applications keep the amounts they
          were quoted.
        </p>
      </div>

      {field("applicationFee", "Application fee (paid first)")}

      {field(
        "scholarshipBalance",
        "Scholarship: balance after admission",
        `Total: ${formatUSD(fee + sch)}`,
      )}

      {field(
        "selfSponsorBalance",
        "Self sponsor: balance after admission",
        `Total: ${formatUSD(fee + self)}`,
      )}

      <Button
        onClick={() => save.mutate()}
        disabled={save.isPending}
        className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
      >
        {save.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          "Save fees"
        )}
      </Button>
    </div>
  );
}
