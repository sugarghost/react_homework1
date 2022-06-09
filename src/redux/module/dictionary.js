import { firestore } from "../../firebase";
// 기능을 호출 할때, 단순히 텍스트를 입력하면 안되고, 엔터로 자동완성에서 선택하면 되는 경우가 있음
// 단순히 import를 안해서 발생하는 문제인듯 함, 자동완성에서는 import가 안되도 예측되는 기능을 소개해주는 것
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, orderBy, query, startAfter, limit} from "firebase/firestore";
import {createReducer} from "@reduxjs/toolkit"

const LOAD = "dictionary/LOAD";
const CLEAR = "dictionary/CLEAR";
const CREATE = "dictionary/CREATE";
const DELETE = "dictionary/DELETE";
const UPDATE = "dictionary/UPDATE";

const initailState = {
  list: [
    {
      id: "33333333333",
      word: "초기데이터3",
      desc: "샘플데이터3",
      example: "예시입니다1",
    },
    {
      id: "22222222222",
      word: "초기데이터2",
      desc: "샘플입니다2",
      example: "예시입니다",
    },
    
    { id: "11111111111", word: "초기데이터1", desc: "샘플입니다", example: "예시입니다" },
  ],
};

// 파이어베이스 버전 9 부터는 콜렉션을 가져오는 방식이 다름
// await 구문을 지우고 사용함, 아마 동기화용인 듯 함
// getDocs를 여기서 썻지만, 다른 이벤트에서도 쓰기 위해 collection만 사용
const dictionary_db = collection(firestore, 'dictionary')
/*
.forEach를 사용하도록 공식 문서에 명시되어있었지만, 함수인식을 못함,
.then을 이용해 한번 펼친 상태에서 진행을 해야지 인식이 가능했음
접근 후에도 doc.data를 통해 데이터 접근이 가능함 doc.id는 문서명
dictionary_db.then((query) => {
  query.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  })
})
*/
export const loadDictionary = (dictionary, lastDoc) => {
  return {
    type: LOAD,
    dictionary,
    lastDoc,
  };
};

export const clearDictionary = () => {
  return {
    type: CLEAR
  };
};

export const createDictionary = (dictionary) => {
  return {
    type: CREATE,
    dictionary,
  };
};

export const deleteDictionary = (id) => {
  return {
    type: DELETE,
    id,
  };
};

export const updateDictionary = (id, dictionary) => {
  return {
    type: UPDATE,
    id,
    dictionary,
  };
};

export const loadDictionaryFB = (lastVisible, limitCount) => {
  return function (dispatch) {
    // id가 임의로 들어오기 때문에 정렬을 위해 timestamp를 추가함
    // 데이터가 들어간 순간 new Date()로 시간을 넣어준 데이터
    // 성능적으로 많은 공간을 차지 할 꺼 같아서 안좋을꺼 같지만, 일단 사용함
    // 페이징을 위해서 startAt, endAt을 사용
    let query_string;
    if(lastVisible !== undefined) {
      query_string = query(dictionary_db, orderBy("timestamp", "desc"), startAfter(lastVisible), limit(limitCount));
    } else {
      // 처음에 예제용 데이터가 들어가는데, 초기 호출 시에 없에고 DB 데이터로 변경하기 위해서 넣음
      dispatch(clearDictionary());
      query_string = query(dictionary_db, orderBy("timestamp", "desc"), limit(limitCount));
    }
    getDocs(query_string).then((query) => {
      if (query.docs.length < limitCount) {
        lastVisible = -1;
      } else {
        // 와 세상에 공식문서 보고 doc만 넣어야 했나 했는데 시간으로도 가능한 일이었음
        // startAfter에서 활용할 기준을 lastDoc에 넣어줌
        // doc를 그대로 넣어주는 경우 어째서인지는 모르겠지만 무한 루프가 터짐
        lastVisible = query.docs[query.docs.length - 1].data().timestamp;
      }
      let dictionary_data = [];
      query.forEach((doc) => {
        if (doc.exists) {
          dictionary_data = [...dictionary_data, { id: doc.id, desc: doc.data().desc, word: doc.data().word, example: doc.data().example}];
        }
      })
      dispatch(loadDictionary(dictionary_data, lastVisible));
    });
  };
};

export const createDictionaryFB = (dictionary, word_type) => {
  return function (dispatch) {
    let dictionary_data = dictionary;
    if (word_type) {
      // addDoc는 ID를 자체적으로 넣어줌, 별도 id를 지정하고 싶다면 setDoc 사용
      // 딕셔너리 타입은 {}로 안묵고 그대로 주면 ID를 맞춰서 잘 넣어줌
      addDoc(dictionary_db,
        dictionary_data
      )
      .then((docRef) => {
        dictionary_data = { ...dictionary_data, id: docRef.id };
        dispatch(createDictionary(dictionary_data))
      })
      .catch((err) => {
        alert("create err");
      });
    } else {
      dictionary_data = { ...dictionary_data, id: dictionary_data.timestamp.getTime() };
      dispatch(createDictionary(dictionary_data))
    }

  };
};

// 수정, 삭제 기능 사용시 파이어베이스에서 자체적으로 ID를 만든 경우는 업데이트 및 삭제됨
// 하지만 단순 텍스트나 숫자를 id로 넣은 경우 업데이트 및 삭제가 안됨
export const deleteBucketFB = (id, word_type) => {
  return function (dispatch) {
    if (word_type) {
    deleteDoc(doc(firestore, 'dictionary', id))
    .then((res) => {
      dispatch(deleteDictionary(id));
    });
    } else {
      dispatch(deleteDictionary(id));
    }
  };
};
export const updateBucketFB = (id, dictionary, word_type) => {
  return function (dispatch) {
    if (word_type) {
    updateDoc(doc(firestore, 'dictionary', id), dictionary)
    .then((res) => {
      dispatch(updateDictionary(id, dictionary));
    });
    } else {
      dispatch(updateDictionary(id, dictionary));
    }
  };
};
// 렌더시에 조회된 데이터가 없으면 sample 데이터(목업 api)를 제공
/* 기존 리듀서 방식을 비활성화 하고 toolkit으로 대체
const reducer = (state = initailState, action) => {
  switch (action.type) {
    case LOAD: {
      if (action.dictionary.length > 0) {
        const add_list = [...state.list, ...action.dictionary];
        return { list: add_list, lastDoc: action.lastDoc };
      }
      return state;
    }
    case CLEAR: {
      return {list: []}
    }
    case CREATE: {
      const new_list = [action.dictionary, ...state.list];
      return { list: new_list };
    }
    case DELETE: {
      const new_list = state.list.filter(({ id }) => {
        return id !== action.id;
      });

      return {
        list: new_list,
      };
    }
    default:
      return state;
  }
};
*/
const reducer = createReducer(initailState,{
  [LOAD]: (state, action) => {
    if (action.dictionary.length > 0) {
      const add_list = [...state.list, ...action.dictionary];
      return { list: add_list, lastDoc: action.lastDoc };
    }
    return state;
  },
  
  [CLEAR]: (state, action) => {
    return {list: [] };
  },
  [CREATE]: (state, action) => {
    const new_list = [action.dictionary, ...state.list];
    return {list: new_list };
  },
  [DELETE]: (state, action) => {
    const new_list = state.list.filter(({ id }) => {
    return id !== action.id;
    });

    return {
      list: new_list,
    };
  },
  [UPDATE]: (state, action) => {
    const new_list = state.list.map((word) => 
      word.id === action.id ? action.dictionary : word
    );
    
    return {
      list: new_list,
    };
  }
})

export default reducer;