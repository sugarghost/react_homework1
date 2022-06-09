import React, {useState} from "react";
// mui에 styled를 사용하기 위해 비활성화
//import styled from "styled-components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// meterial 버전을 5로올리면서 기존 버전 사용은 비활성화
// import { Button, ButtonGroup } from "@material-ui/core";
import { loadDictionaryFB, deleteBucketFB} from "./redux/module/dictionary";
// v6 이후로 History대신 Navigate를 사용
import { useNavigate } from "react-router-dom";
import {Button, ButtonGroup, Box, Card, CardContent, Typography} from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import styled from '@emotion/styled';

// 무한 스크롤을 이용하고자 했으나 동기 처리 버그 생겨서 일단 버튼으로 대체
// import { useInView } from "react-intersection-observer"

let limitCount = 5;

const MyDictionary = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dic_list = useSelector((state) => state.dictionary.list);
  // 무한 스크롤을 위해서 다음에 데이터를 가져오는 startAfter 기준을 잡기 위한 변수
  const lastVisible = useSelector((state) => state.dictionary.lastDoc);
  const word_type = lastVisible == null ? false: true
  console.log(word_type)
  // 무한 스크롤을 위해 로딩 상태를 정의
  const [loading, setLoading] = useState(false);

  const deleteWord = (id) => {
    dispatch(deleteBucketFB(id, word_type));
  };
  // const loadWords = useCallback((lastVisible, limitCount) => dispatch(loadDictionaryFB(lastVisible, limitCount)), [dispatch]);
  const reload = () => {
    setLoading(true)
    dispatch(loadDictionaryFB(lastVisible, limitCount));
    setLoading(false)
  }

  const updateWord = (selected_id) => {
    const selected_word = dic_list.find(({ id }) => {
      return id === selected_id;
    });
    // history에서 navigate로 변경하면서 문법을 변경
    // 기존에 pathname을 state와 같이 입력했지만 이젠 별개로 취급
    navigate('/word/update', {
      state: {
        selected_word: selected_word,
        word_type: word_type
      },
    });
  };
  return (
    <>
      <h4>MY DICTIONARY</h4>

      {dic_list.length === 0 ? (
        <Card>
          <CardContent>
            <Typography sx={{fontSize: 20}}>
              현재 추가된 단어가 존재하지 않습니다.
              <br></br>
              오른쪽 플러스 버튼을 눌러 사전을 등록해주세요.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        dic_list.map((props, index) => {
          return (
            <Box sx={{ minWidth: 275, mb: 2 }}>
              <Card key={props.id} variant="outlined">
                <CardContent>
                  <ButtonGroup variant="contained" aria-label="outlined button group">
                    <Button onClick={() => {updateWord(props.id);}}>
                      수정
                    </Button>
                    <Button onClick={() => {deleteWord(props.id);}}>
                      삭제
                    </Button>
                  </ButtonGroup>
                </CardContent>
                <CardContent>
                  <Typography sx={{fontSize: 12}}>단어</Typography>
                  <Typography sx={{fontSize: 20}}>{props.word}</Typography>
                </CardContent>
                <CardContent>
                  <Typography sx={{fontSize: 12}}>설명</Typography>
                  <Typography sx={{fontSize: 20}}>{props.desc}</Typography>
                </CardContent>
                <CardContent>
                  <Typography sx={{fontSize: 12}}>예시</Typography>
                  <Typography sx={{fontSize: 20}} color="blue">{props.example}</Typography>
                </CardContent>
              </Card>
            </Box>
          );
        })
      )}
      { loading ? (
        <p>로딩중...</p>
      ) : lastVisible > 0 || lastVisible === undefined? (
        <Button variant="contained" onClick={() => reload()}>불러오기</Button>      
      ) : (
        <p>더이상 데이터가 없습니다.</p>
      )}
      <Link to="/word/add">
        <PlusBtn color="primary">add_circle</PlusBtn>
      </Link>
    </>
  );
};

const PlusBtn = styled(AddBoxIcon)`
  width: 50px;
  height: 50px;
  position: absolute;
  right: 10px;
  bottom: 10px;
  line-height: 42px;
  text-align: center;
  font-size: 50px;
  cursor: pointer;
`;
export default MyDictionary;