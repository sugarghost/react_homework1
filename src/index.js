import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './redux/configStore'

const root = ReactDOM.createRoot(document.getElementById('root'));
/* store를 연동하기 위해 Provider를 사용

  <React.StrictMode>를 사용하면 로그가 2번 찍히는 사항이 있었음
  개발도중 확인을 위한 모드로 실행이 2번 됨
*/
root.render(
    <Provider store={store}>
      <App />
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
