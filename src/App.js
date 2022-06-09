import "./App.css";
import MyDictionary from "./MyDictionary";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import AddWord from "./AddWord";
import styled from "styled-components";
import NotFound from "./NotFound";

function App() {
  return (
    <div className="App">
      <Container>
        <Wrapper>
          <BrowserRouter>
            <Routes>              
              <Route path="/" element={<MyDictionary/>}></Route>
              <Route path="/word/:type/*" element={<AddWord/>}></Route>
              <Route path="*" element={<NotFound/>}></Route>
            </Routes>
          </BrowserRouter>
        </Wrapper>
      </Container>
    </div>
  );
}
const Container = styled.div`
  background-color: skyblue;
  max-width: 50vw;
  margin: auto;
`;

const Wrapper = styled.div`
  padding: 20px 10px;
  position: relative;
`;

export default App;