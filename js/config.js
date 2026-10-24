// 北海道行程網站：共用資料庫設定
// 到 Firebase 主控台 →「專案設定」→「一般」→「你的應用程式」→ 網頁應用程式的「SDK 設定和配置」，
// 把 firebaseConfig 裡的值逐一貼到下面的引號裡（measurementId 有的話也可以不貼）。
// 這些值本來就是公開的，不是密碼；真正保護資料的是「邀請連結」裡的帳本代碼和 firestore.rules。
// 全部留空的話，網站照樣能用，只是記帳和清單只存在各自的手機裡。

window.TRIP_CONFIG = {
  firebase: {
    apiKey: "AIzaSyAJpK0KoyGcfo__3ACdqxQLT6SHAQPTX2c",
    authDomain: "hokkaido-2027-d753b.firebaseapp.com",
    projectId: "hokkaido-2027-d753b",
    storageBucket: "hokkaido-2027-d753b.firebasestorage.app",
    messagingSenderId: "374237512825",
    appId: "1:374237512825:web:2fe3d7497410572eba80a8"
  }
};
