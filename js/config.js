// 北海道行程網站：共用資料庫設定
// 全部留空的話，網站照樣能用，只是記帳和清單只存在各自的手機裡

window.TRIP_CONFIG = {
  firebase: {
    apiKey: "AIzaSyAJpK0KoyGcfo__3ACdqxQLT6SHAQPTX2c",
    authDomain: "hokkaido-2027-d753b.firebaseapp.com",
    projectId: "hokkaido-2027-d753b",
    storageBucket: "hokkaido-2027-d753b.firebasestorage.app",
    messagingSenderId: "374237512825",
    appId: "1:374237512825:web:2fe3d7497410572eba80a8"
  },
  // 掃收據用的 Gemini 模型
  ai: {
    model: "gemini-3.5-flash"
  },
  // 留空不啟用
  appCheck: {
    siteKey: "6Ldcnv4tAAAAAAbf9VVzovrEKplh-y6agkXqCzoI"
  }
};
