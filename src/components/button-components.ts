import { styled } from "styled-components";

const Button = styled.button`
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export const DeleteButton = styled(Button)`
  background-color: tomato;
  color: white;
  font-weight: 600;
`;

export const EditButton = styled(Button)`
  background-color: white;
  color: black;
  font-weight: 600;
`;

export const CancelButton = styled(Button)`
  background-color: white;
  color: tomato;
  font-weight: 600;
`;

export const SaveButton = styled(Button)`
  background-color: white;
  color: blue;
  font-weight: 600;
`;
