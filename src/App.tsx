import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";
import CreateBoard from "./Components/CreateBoard";
import DeleteIcon from "./images/delete_white_24dp.svg";

const Wrapper = styled.div`
  display: flex;
  max-width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;

const TrashCan = styled.div<{ isDraggingOver: boolean }>`
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.boardColor};
  transition: all 0.2s;
  transform: ${(props) => (props.isDraggingOver ? "scale(1.2)" : "")};
  opacity: ${(props) => (props.isDraggingOver ? "0.8" : "")};

  img {
    display: block;
  }
`;

function App() {
  const [toDos, setTodos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    console.log(info);
    const { destination, source } = info;
    if (!destination) return;
    if (source.droppableId === "boards") {
      setTodos((allBoards) => {
        const boardsCopy = Object.entries(allBoards);
        const taskObj = boardsCopy[source.index];
        boardsCopy.splice(source.index, 1);
        boardsCopy.splice(destination.index, 0, taskObj);
        return Object.fromEntries(boardsCopy);
      });
      return;
    }
    if (destination.droppableId === "trashcan") {
      setTodos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        return { ...allBoards, [source.droppableId]: boardCopy };
      });
      return;
    }
    if (destination?.droppableId === source.droppableId) {
      // same board movement.
      setTodos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }

    if (destination?.droppableId !== source.droppableId) {
      // cross board movement
      setTodos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <CreateBoard />
      <Droppable droppableId="boards" direction="horizontal" type="board">
        {(magic) => (
          <Wrapper>
            <Boards ref={magic.innerRef} {...magic.droppableProps}>
              {Object.keys(toDos).map((boardId, index) => (
                <Board
                  boardId={boardId}
                  key={boardId}
                  toDos={toDos[boardId]}
                  index={index}
                />
              ))}
              {magic.placeholder}
            </Boards>
            <Droppable droppableId="trashcan">
              {(provided, snapshot) => (
                <TrashCan
                  ref={provided.innerRef}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  <img src={DeleteIcon} alt="icon" />
                </TrashCan>
              )}
            </Droppable>
          </Wrapper>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
