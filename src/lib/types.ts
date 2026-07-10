// 儀式流程的五個步驟
export type Step = 'form' | 'draw' | 'pray' | 'burn' | 'done';

// 使用者填寫的祈願資料
export interface WishData {
  eventName: string; // 活動名稱
  startDate: string; // 開始日期（yyyy-mm-dd）
  endDate: string; // 結束日期（yyyy-mm-dd，空字串代表單日）
  place: string; // 地點
  wish: string; // 祈願詞（限肯定句）
}
