// =============================================================================
// CONFIGURATION FOR MONTHLY FINANCIAL REPORT
// =============================================================================

export const CONFIG = {
  // Pagination settings
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },

  // Search and filter settings
  SEARCH: {
    DEBOUNCE_DELAY: 600, // milliseconds
  },

  // Toast messages
  MESSAGES: {
    SUCCESS: {
      DATA_LOADED: "اطلاعات مالی با موفقیت دریافت شد",
      EXPENSE_CREATED: "هزینه با موفقیت اضافه شد",
      EXPENSE_UPDATED: "هزینه با موفقیت بروزرسانی شد",
      EXPENSE_DELETED: "هزینه با موفقیت حذف شد",
      RECORDS_LOADED: "سوابق مالی با موفقیت دریافت شد",
      HEAVY_DATA_LOADED: "داده‌های سنگین با موفقیت بارگذاری شد",
    },
    ERROR: {
      FETCH_DATA: "خطا در دریافت اطلاعات مالی",
      CREATE_EXPENSE: "خطا در ایجاد هزینه",
      UPDATE_EXPENSE: "خطا در بروزرسانی هزینه",
      DELETE_EXPENSE: "خطا در حذف هزینه",
      FETCH_RECORDS: "خطا در دریافت لیست سوابق مالی",
      FETCH_EXPENSES: "خطا در دریافت لیست هزینه‌ها",
      HEAVY_DATA: "خطا در بارگذاری داده‌های سنگین",
    },
  },
};

// =============================================================================
// EXPORT CONFIGURATION
// =============================================================================

export default CONFIG;
