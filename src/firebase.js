//firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  // firebase 설정과 관련된 개인 정보
  apiKey: "AIzaSyAEk1xG9YX9ABO2tZ_o_nl1IC8qfffkXjw",
  authDomain: "sparta-react-yoony.firebaseapp.com",
  projectId: "sparta-react-yoony",
  storageBucket: "sparta-react-yoony.appspot.com",
  messagingSenderId: "268281847770",
  appId: "1:268281847770:web:d8cba83f8f9f79430deae3"
};

// firebaseConfig 정보로 firebase 시작
initializeApp(firebaseConfig);
// firebase의 firestore 인스턴스를 변수에 저장
const firestore = getFirestore();
// 필요한 곳에서 사용할 수 있도록 내보내기
export { firestore };