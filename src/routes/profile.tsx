import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweets";
import { CancelButton, SaveButton } from "../components/button-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;
const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const Column = styled.div``;

const Form = styled.form``;

const NameInput = styled.input``;

const EditClickSpan = styled.span`
  cursor: pointer;
  svg {
    width: 20px;
  }
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [userName, setUserName] = useState(user?.displayName);
  const [profileEditmode, setProfileEditmode] = useState(false);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };

  const getMyTweetsSnapshot = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createAt", "desc"),
      limit(25)
    );
    return await getDocs(tweetQuery);
  };

  const fetchTweets = async () => {
    const tweets = (await getMyTweetsSnapshot()).docs.map((doc) => {
      const { tweet, createAt, photo, username, userId } = doc.data();
      return {
        tweet,
        createAt,
        photo,
        username,
        userId,
        id: doc.id,
      };
    });
    setTweets(tweets);
  };

  const onProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const onEditSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user) return;
    await updateProfile(user, {
      displayName: userName,
    });
    updateMyTweets();
    setProfileEditmode(false);
  };

  const onEditCancle = () => {
    setUserName(user?.displayName);
    setProfileEditmode(false);
  };

  const onEditBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setProfileEditmode(true);
  };

  const updateMyTweets = async () => {
    console.log(userName);
    (await getMyTweetsSnapshot()).docs.map((doc) => {
      updateDoc(doc.ref, {
        username: userName,
      });
      fetchTweets();
    });
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <Form>
        {profileEditmode ? null : (
          <Name>
            {/* {user?.displayName ? user.displayName : "Anonymous"} */}
            {userName ?? "Anonymous"}
          </Name>
        )}

        {profileEditmode ? (
          <NameInput
            onChange={onProfileChange}
            value={userName ?? "Anonymous"}
            type="text"
          />
        ) : null}

        {profileEditmode ? (
          <Column>
            <SaveButton onClick={onEditSave}>Save</SaveButton>
            <CancelButton onClick={onEditCancle}>Cancle</CancelButton>
          </Column>
        ) : (
          <EditClickSpan onClick={onEditBtnClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
          </EditClickSpan>
        )}
      </Form>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
