import React, { Fragment, useEffect, useState } from "react";
import { debounce } from "lodash";

import { useAppDispatch, useAppSelector } from "../../hooks/appHook";
import { sendMessage } from "../../redux/chat/chatApi";
import {
  getChatHistory,
  getIsLoadingChat,
  setApiKey,
} from "../../redux/chat/chatSlice";
import notification from "../Notification/notificationTypes";

import { ReactComponent as CopyIcon } from "../../assets/copy.svg";
import { ReactComponent as LoadingIcon } from "../../assets/loading.svg";

interface IAnswerMessage {
  content?: string;
}
const AnswerMessage = ({ content }: IAnswerMessage) => {
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    notification.notificationSuccess("Copied");
  };

  const debouncedHandleCopy = debounce(handleCopy, 200);
  return (
    <>
      <div className="mb-2 flex w-full flex-row justify-end gap-x-2 text-slate-500">
        <button
          className={`hover:text-blue-600 ${
            !content ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="button"
          onClick={() => debouncedHandleCopy(content || "")}
        >
          <CopyIcon />
        </button>
      </div>
      <div className="mb-4 flex rounded-xl bg-slate-50 px-2 py-6 dark:bg-slate-900 sm:px-4">
        <img
          alt="User"
          className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
          src="https://dummyimage.com/256x256/354ea1/ffffff&text=G"
        />

        <div className="flex max-w-3xl items-center rounded-xl">
          {content ? (
            <p>{content}</p>
          ) : (
            <div role="status" className="max-w-sm animate-pulse">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const Messages = () => {
  const chatHistory = useAppSelector(getChatHistory);
  const isLoadingData = useAppSelector(getIsLoadingChat);

  const messagesRef: React.LegacyRef<HTMLDivElement> = React.createRef();

  useEffect(() => {
    const handleScroll = () => {
      messagesRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    handleScroll();

    return () => {};
  }, [chatHistory, messagesRef]);

  return (
    <Fragment>
      {
        <Fragment>
          {chatHistory.map((el) => {
            return (
              <Fragment>
                {el.type === "request" && (
                  <div key={el.id} className="flex px-2 py-4 sm:px-4">
                    <img
                      alt="user"
                      className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
                      src="https://dummyimage.com/256x256/363536/ffffff&text=U"
                    />

                    <div className="flex max-w-3xl items-center">
                      <p>{el.content}</p>
                    </div>
                  </div>
                )}

                {el.type === "answer" && (
                  <AnswerMessage content={el.content} key={el.id} />
                )}
              </Fragment>
            );
          })}

          {isLoadingData && <AnswerMessage />}
        </Fragment>
      }
      <div ref={messagesRef} />
    </Fragment>
  );
};

const Form = () => {
  const dispatch = useAppDispatch();
  const isLoadingData = useAppSelector(getIsLoadingChat);
  const [userInput, setUserInput] = useState("");

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(evt.target.value);
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    dispatch(sendMessage(userInput));
    setUserInput("");
  };

  return (
    <form className="mt-2" onSubmit={(evt) => handleSubmit(evt)}>
      <label htmlFor="chat-input" className="sr-only">
        Enter your prompt
      </label>

      <div className="relative">
        <textarea
          id="chat-input"
          className="block w-full resize-none rounded-xl border-none bg-slate-200 p-4 pl-10 pr-20 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-blue-500 sm:text-base"
          placeholder="Enter your prompt"
          rows={1}
          required
          disabled={isLoadingData}
          value={userInput}
          onChange={(evt) => handleChange(evt)}
        ></textarea>
        <button
          type="submit"
          className={`absolute bottom-2 right-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:text-base inline-flex items-center ${
            isLoadingData || userInput.length === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {isLoadingData ? (
            <Fragment>
              <LoadingIcon />
              Loading...
            </Fragment>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </form>
  );
};

const Chat = () => {
  const dispatch = useAppDispatch();
  const [userInput, setUserInput] = useState("");

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(evt.target.value);
  };

  const handleSaveApiKey = () => {
    dispatch(setApiKey(userInput));
    setUserInput("");

    notification.notificationInfo("Saved");
  };

  return (
    <Fragment>
      <div className="relative">
        <input
          type="password"
          id="search"
          className="block w-full p-4 ps-20 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter OpenAI key: sk-***"
          value={userInput}
          onChange={(evt) => handleChange(evt)}
        />
        <button
          type="submit"
          className={`text-white absolute start-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
            userInput.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSaveApiKey}
        >
          Save
        </button>
      </div>

      <div className="flex h-[75vh] w-full flex-col my-8">
        <div className="flex-1 overflow-y-auto rounded-xl bg-slate-200 p-4 text-sm leading-6 text-slate-900 dark:bg-slate-800 dark:text-slate-300 sm:text-base sm:leading-7">
          <Messages />
        </div>

        <Form />
      </div>
    </Fragment>
  );
};

export default Chat;
