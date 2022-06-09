import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { createDictionaryFB, updateBucketFB } from "./redux/module/dictionary";
import { useNavigate, useLocation, useParams } from "react-router-dom";

// match를 사용하지 않아서 파라미터에서 match 제거
const AddWord = () => {
  const wordInput = useRef();
  const descInput = useRef();
  const exampleInput = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // location.state가 undefined가 아닌 경우 location에서 값을 가져오는 로직이었음
    // 다만 실행해보니 실제 값이 null이라서 에러가 발생함
    // undefined대신 null 검사를 하니 해결됨
    if (location.state !== null) {
      const { word, desc, example } = location.state.selected_word;

      wordInput.current.value = word;
      descInput.current.value = desc;
      exampleInput.current.value = example;
    }
  },);

  let typeTitle;
  // 기존에 파라미터를 받기 위해 match를 사용했지만, 버전 6부터는 useParams 사용
  let params = useParams();
  if (params.type === "update") {
    typeTitle = "수정";
  } else {
    typeTitle = "추가";
  }

  const addWord = () => {
    const new_list_state = {
      word: wordInput.current.value,
      desc: descInput.current.value,
      example: exampleInput.current.value,
      timestamp: new Date()
    };

    if (params.type === "update") {
      let id = location.state.selected_word.id;
      dispatch(updateBucketFB(id, new_list_state));
    } else {
      dispatch(createDictionaryFB(new_list_state));
    }
    navigate(-1);
  };

  return (
    <>
      <Title>단어 {typeTitle}하기</Title>
      <ContentBox>
        <Content>
          <ContentTitle>단어</ContentTitle>
          <ContentInput name="word" ref={wordInput} />
        </Content>
        <Content>
          <ContentTitle>설명</ContentTitle>
          <ContentInput name="desc" ref={descInput} />
        </Content>
        <Content>
          <ContentTitle>예시</ContentTitle>
          <ContentInput name="example" ref={exampleInput} />
        </Content>
      </ContentBox>
      <AddBtn
        onClick={() => {
          addWord();
        }}
      >
        {typeTitle}하기
      </AddBtn>
    </>
  );
};

const Title = styled.h4``;

const ContentBox = styled.div`
  background-color: #fff;
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  margin: 15px 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  &:nth-child(odd) {
    margin: 20px 0;
  }
`;

const ContentTitle = styled.div`
  font-size: 0.8rem;
  text-decoration: underline;
`;

const ContentInput = styled.input`
  height: 30px;
  margin-top: 10px;
`;

const AddBtn = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 50px;
  background-color: purple;
  color: #fff;
  text-align: center;
  font-size: 30px;
  cursor: pointer;
  line-height: 50px;
  margin-top: 40px;
`;

export default AddWord;