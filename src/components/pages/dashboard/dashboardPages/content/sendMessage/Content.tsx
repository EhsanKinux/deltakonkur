import showToast from "@/components/ui/toast";
import { useContent } from "@/functions/hooks/content/useContent";
import { IContent } from "@/lib/apis/content/interface";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";
import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { contentAdvisorColumns } from "./_components/table/ContentAdvisorColumnDef";
import { ContentAdvisorTable } from "./_components/table/ContentAdvisorTable";

const Content = () => {
  const [advisors, setAdvisors] = useState([]);
  const [searchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const getAdvisors = useCallback(async () => {
    const { accessToken } = authStore.getState(); // گرفتن accessToken از authStore

    const page = searchParams.get("page") || 1;
    const firstName = searchParams.get("first_name") || "";
    const lastName = searchParams.get("last_name") || "";

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsLoading(true);
      const { data } = await axios.get(`${BASE_API_URL}api/advisor/advisors/`, {
        params: {
          page,
          first_name: firstName,
          last_name: lastName,
        },
        signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // اضافه کردن هدر Authorization
        },
      });

      setAdvisors(data.results);
      setTotalPages(Number(data.count / 10).toFixed(0));
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
      } else {
        console.error("خطا در دریافت اطلاعات مشاوران:", error);
      }
    }
    setIsLoading(false);
  }, [searchParams, setAdvisors]);

  const debouncedGetAdvisors = useCallback(debounce(getAdvisors, 50), [
    getAdvisors,
  ]);

  useEffect(() => {
    debouncedGetAdvisors();
    return () => {
      debouncedGetAdvisors.cancel();
    };
  }, [debouncedGetAdvisors, searchParams]);

  const { sendContent } = useContent();

  const [advisorSubjects, setAdvisorSubjects] = useState<
    Record<number, string>
  >({});

  const updateSubject = (advisorId: number, value: string) => {
    setAdvisorSubjects((prev) => ({
      ...prev,
      [advisorId]: value,
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    setIsLoading(true);

    const dataArray: IContent[] = Object.entries(advisorSubjects)
      .filter(([, subject]) => subject)
      .map(([advisorId, subject]) => ({
        advisor: advisorId.toString(), // تبدیل به string
        subject,
      }));

    if (dataArray.length > 0) {
      showToast.promise(
        sendContent(dataArray).then(() => {
          setAdvisorSubjects({});
        }),
        {
          loading: "در حال ارسال پیام...",
          success: "ارسال پیام با موفقیت انجام شد!",
          error: (err: unknown) => {
            // err is likely an Error with a string message (possibly JSON)
            if (err && typeof err === "object" && "message" in err) {
              const errorMessage = (err as { message: string }).message;
              try {
                const parsed = JSON.parse(errorMessage);
                if (
                  parsed &&
                  typeof parsed === "object" &&
                  "message" in parsed
                ) {
                  return "خطا: " + (parsed as { message: string }).message;
                }
              } catch {
                // Not JSON, just show the message
                return errorMessage.includes("detail")
                  ? "خطا: " + errorMessage.split(`"`)[3]
                  : "خطایی رخ داده است";
              }
              return errorMessage.includes("detail")
                ? "خطا: " + errorMessage.split(`"`)[3]
                : "خطایی رخ داده است";
            }
            return "خطایی رخ داده است";
          },
        }
      );
    } else {
      showToast.error(
        "موضوعی برای ارسال وجود ندارد. لطفا ابتدا موضوعات خود را وارد کنید."
      );
    }
    setIsLoading(false);
  };

  return (
    <section className="flex flex-col gap-4">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">
        محتوا
      </h1>
      <form
        onSubmit={onSubmit}
        className="mt-4 px-8 w-full min-h-screen rounded-xl "
      >
        <div className="flex flex-col items-center justify-center bg-slate-100 rounded-xl shadow-form px-5 py-10 xl:p-5 relative min-h-[150vh]">
          <ContentAdvisorTable
            columns={contentAdvisorColumns}
            data={advisors}
            updateSubject={updateSubject}
            totalPages={totalPages}
            isLoading={isLoading}
            advisorSubjects={advisorSubjects}
          />
        </div>
      </form>
    </section>
  );
};

export default Content;
