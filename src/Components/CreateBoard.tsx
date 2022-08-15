import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";

const Form = styled.form`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 32px;
`;

const Input = styled.input`
  appearance: none;
  border: none;
  border-bottom: 1px solid white;
  background-color: transparent;
  font-size: 16px;
  color: white;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

interface IForm {
  toDo: string;
}

function CreateBoard() {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onVaild = (board: IForm) => {
    const newToDo = board.toDo;
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [newToDo]: [],
      };
    });
    setValue("toDo", "");
  };
  return (
    <Form onSubmit={handleSubmit(onVaild)}>
      <Input
        {...register("toDo", { required: true })}
        type="text"
        placeholder="Add new board"
      />
    </Form>
  );
}

export default CreateBoard;
