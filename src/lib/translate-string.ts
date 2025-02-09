/**
 * A function to replace the string with the arabic string
 * @param string the string to be replaced
 * @returns the replaced string
 * */
export const translateSring = (string: string) => {
  switch (string) {
    case "projectName":
    case "name": {
      return "الاسم";
    }
    case "projectStatus":
    case "status": {
      return "الحالة";
    }
    case "projectLocation": {
      return "موقع المشروع";
    }
    case "projectStartDate": {
      return "تاريخ بداية المشروع";
    }
    case "projectEndDate": {
      return "تاريخ نهاية المشروع";
    }
    case "projectInvestDate": {
      return "تاريخ الاستثمار";
    }
    case "projectProfitsCollectDate": {
      return "تاريخ جمع الأرباح";
    }
    case "projectStudyCase": {
      return "دراسة الجدوى";
    }
    case "projectStudyCaseVisibility": {
      return "إظهار دراسة الجدوى";
    }
    case "projectAvailableStocks": {
      return "الأسهم المتاحة";
    }
    case "projectTotalStocks": {
      return "إجمالي الأسهم";
    }
    case "projectStockPrice": {
      return "سعر السهم";
    }
    case "projectSpecialPercentage": {
      return "نسبة زيادة خاصة";
    }
    case "projectSpecialPercentageCode": {
      return "رمز نسبة الزيادة الخاصة";
    }
    case "projectStockProfits": {
      return "أرباح السهم";
    }
    case "projectDescription": {
      return "وصف المشروع";
    }
    case "projectTerms": {
      return "شروط المشروع";
    }
    case "actions": {
      return "الإجراءات";
    }
    case "active": {
      return "نشط";
    }
    case "pending": {
      return "معلق";
    }
    case "block": {
      return "محظور";
    }
    case "email": {
      return "البريد الإلكتروني";
    }
    case "role": {
      return "الدور";
    }
    case "admin": {
      return "مدير";
    }
    case "user": {
      return "مستخدم";
    }
    default: {
      return string;
    }
  }
};
