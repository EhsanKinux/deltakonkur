import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import showToast from "@/components/ui/toast";
import { BASE_API_URL } from "@/lib/variables/variables";
import { authStore } from "@/lib/store/authStore";
import { convertToShamsi } from "@/lib/utils/date/convertDate";
import axios from "axios";

interface SearchContentItem {
  id: number;
  advisor: {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
  };
  solar_year: number | null;
  solar_month: number | null;
  is_delivered: boolean;
  delivered_at: string | null;
  notes: string | null;
  created: string;
  updated: string;
  persian_month_name: string;
}

const SearchContentTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setSearchData] = useState<SearchContentItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [searchCount, setSearchCount] = useState(0);
  const [searchNext, setSearchNext] = useState<string | null>(null);
  const [searchPrevious, setSearchPrevious] = useState<string | null>(null);

  const fetchSearch = async (pageNum = 1, q = searchQuery) => {
    setSearchLoading(true);
    try {
      const { accessToken } = authStore.getState();
      const res = await axios.get(
        BASE_API_URL + "/api/content/contents/search/",
        {
          params: { page: pageNum, q },
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setSearchData(res.data.results);
      setSearchCount(res.data.count);
      setSearchNext(res.data.next);
      setSearchPrevious(res.data.previous);
    } catch (e) {
      showToast.error("خطا در جستجو");
    }
    setSearchLoading(false);
  };

  const handleSearch = () => {
    fetchSearch(1, searchQuery);
    setSearchPage(1);
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 mt-2 bg-white shadow-lg rounded-2xl min-h-[60vh] w-full overflow-auto transition-all duration-300">
      <div className="mb-4 font-bold text-lg text-blue-800">جستجو در محتوا</div>
      <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
        <Input
          placeholder="جستجو در محتوا..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full md:w-64 focus:ring-2 focus:ring-blue-400"
        />
        <Button
          onClick={handleSearch}
          disabled={searchLoading || !searchQuery}
          className="mt-2 md:mt-0 focus:ring-2 focus:ring-blue-400"
        >
          {searchLoading ? <Loader2 className="animate-spin" /> : "جستجو"}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table className="!rounded-xl border w-full md:min-w-[700px] bg-slate-50 shadow-sm">
          <TableHeader className="bg-slate-200 sticky top-0 z-10">
            <TableRow>
              <TableHead className="!text-center w-12 border-slate-300">
                #
              </TableHead>
              <TableHead className="!text-center border-slate-300">
                مشاور
              </TableHead>
              <TableHead className="!text-center border-slate-300">
                شماره تماس
              </TableHead>
              <TableHead className="!text-center border-slate-300">
                ماه شمسی
              </TableHead>
              <TableHead className="!text-center border-slate-300">
                تاریخ ایجاد
              </TableHead>
              <TableHead className="!text-center border-slate-300">
                وضعیت تحویل
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searchLoading ? (
              Array.from({ length: 10 }).map((_, idx) => (
                <TableRow key={idx}>
                  {Array.from({ length: 6 }).map((_, colIdx) => (
                    <TableCell
                      key={colIdx}
                      className="!text-center border-slate-100"
                    >
                      <div className="h-4 w-full rounded bg-slate-200 animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : Array.isArray(searchData) && searchData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500"
                >
                  نتیجه‌ای یافت نشد.
                </TableCell>
              </TableRow>
            ) : (
              (Array.isArray(searchData) ? searchData : []).map((row, idx) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-blue-50 transition-all duration-200"
                >
                  <TableCell className="!text-center font-bold border-slate-100">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="!text-center border-slate-100">
                    {row.advisor.first_name} {row.advisor.last_name}
                  </TableCell>
                  <TableCell className="!text-center border-slate-100">
                    {row.advisor.phone_number}
                  </TableCell>
                  <TableCell className="!text-center border-slate-100">
                    {row.persian_month_name}
                  </TableCell>
                  <TableCell className="!text-center border-slate-100">
                    {convertToShamsi(row.created)}
                  </TableCell>
                  <TableCell className="!text-center border-slate-100">
                    {row.is_delivered ? (
                      <span className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-full font-bold">
                        تحویل داده شده
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded-full font-bold">
                        در انتظار تحویل
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button
          variant="outline"
          className="rounded-full border-slate-300 px-4 py-2 text-xs font-bold transition-all duration-200 disabled:opacity-50 focus:ring-2 focus:ring-blue-400"
          disabled={!searchPrevious || searchLoading}
          onClick={() => {
            if (searchPage > 1) {
              setSearchPage((p) => p - 1);
              fetchSearch(searchPage - 1);
            }
          }}
        >
          صفحه قبل
        </Button>
        <span className="mx-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 font-bold text-xs">
          صفحه {searchPage} از {Math.ceil(searchCount / 10) || 1}
        </span>
        <Button
          variant="outline"
          className="rounded-full border-slate-300 px-4 py-2 text-xs font-bold transition-all duration-200 disabled:opacity-50 focus:ring-2 focus:ring-blue-400"
          disabled={!searchNext || searchLoading}
          onClick={() => {
            setSearchPage((p) => p + 1);
            fetchSearch(searchPage + 1);
          }}
        >
          صفحه بعد
        </Button>
      </div>
    </div>
  );
};

export default SearchContentTab;
