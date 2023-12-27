import { useState } from "react";
import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import {
  CancelButton,
  DeleteButton,
  EditButton,
  SaveButton,
} from "./button-components";
import { TextArea } from "./textarea-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

// const DeleteButton = styled.button`
//   background-color: tomato;
//   color: white;
//   font-weight: 600;
//   border: 0;
//   font-size: 12px;
//   padding: 5px 10px;
//   text-transform: uppercase;
//   border-radius: 5px;
//   cursor: pointer;
// `;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const [editMode, setEditMode] = useState(false);
  const [editedTweet, setEditedTweet] = useState(tweet);
  const user = auth.currentUser;
  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedTweet(e.target.value);
  };

  const onEdit = async () => {
    setEditMode(true);
  };

  const onEditCancel = async () => {
    setEditMode(false);
    setEditedTweet(tweet);
  };

  const onSave = async () => {
    const ok = confirm("Are you sure you want to save this changes?");

    if (!ok) return;
    const docRef = doc(db, "tweets", id);
    await updateDoc(docRef, {
      tweet: editedTweet,
    });

    setEditMode(false);
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>

        {user?.uid === userId && !editMode ? (
          <Payload>{tweet}</Payload>
        ) : (
          <TextArea
            required
            rows={2}
            maxLength={180}
            onChange={onChange}
            value={editedTweet}
            placeholder="What is happening?"
          />
        )}

        {user?.uid === userId && !editMode ? (
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        ) : null}
        {user?.uid === userId && editMode ? (
          <CancelButton onClick={onEditCancel}>Cancel</CancelButton>
        ) : null}
        {user?.uid === userId && !editMode ? (
          <EditButton onClick={onEdit}>Edit</EditButton>
        ) : null}
        {user?.uid === userId && editMode ? (
          <SaveButton onClick={onSave}>Save</SaveButton>
        ) : null}
      </Column>
      {photo ? (
        <Column>
          <Photo src={photo}></Photo>
        </Column>
      ) : null}
    </Wrapper>
  );
}
