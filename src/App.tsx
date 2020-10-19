/** @format */

import * as React from "react";
import styled from "styled-components";

type TagType = "email" | "number";

interface IProps {
  tagRegExp?: TagType | RegExp;
}
interface TagInfo {
  id: number;
  value: string;
}

enum KeyCode {
  Enter = "Enter",
  Tab = "Tab",
  Space = " ",
  BackSpace = "Backspace",
}

const App: React.FC<IProps> = ({ tagRegExp = "number" }) => {
  const [active, setActive] = React.useState(false);
  const [tags, setTags] = React.useState<TagInfo[]>([]);
  const [input, setInput] = React.useState<string>("");
  const [validate, setValidate] = React.useState<boolean>(true);

  const regExp = React.useMemo<RegExp>(() => {
    if (typeof tagRegExp === "function") {
      return tagRegExp as RegExp;
    } else {
      switch (tagRegExp) {
        case "email":
          return /^[\w-]+@[\w-]+(?:\.[a-z]+)*\.[a-z]{​​​​​2,4}​​​​​$/i;
        default:
          return /^\d+$/;
      }
    }
  }, [tagRegExp]);

  const updateTags = React.useCallback(() => {
    // validate input data
    if (input !== "") {
      console.log(input, regExp, regExp.test(input));
      if (regExp.test(input)) {
        setTags([...tags, { id: Date.now(), value: input }]);
        setInput("");
        setValidate(true);
      } else {
        setValidate(false);
      }
    }
  }, [input, regExp, tags]);

  const handleBlur = React.useCallback(() => {
    setActive(false);
    updateTags();
  }, [updateTags]);

  const removeTag = React.useCallback(
    (key: number) => {
      const removedTags = tags.filter((tag) => tag.id !== key);
      setTags(removedTags);
    },
    [tags]
  );

  const handleChange = React.useCallback<
    (event: React.ChangeEvent<HTMLInputElement>) => void
  >((event) => {
    setInput(event.currentTarget.value);
  }, []);

  const handleKeyDown = React.useCallback<
    (event: React.KeyboardEvent<HTMLInputElement>) => void
  >(
    (event) => {
      console.log("Key Down", event.key);
      if (
        event.key === KeyCode.Enter ||
        event.key === KeyCode.Tab ||
        event.key === KeyCode.Space
      ) {
        event.preventDefault();
        updateTags();
      } else if (
        event.key === KeyCode.BackSpace &&
        input === "" &&
        tags.length > 0
      ) {
        event.preventDefault();
        removeTag(tags[tags.length - 1].id);
      }
    },
    [input, updateTags, removeTag, tags]
  );

  const handleFocus = React.useCallback(() => {
    setActive(true);
  }, []);

  const tagsComp = React.useMemo(
    () =>
      tags.map((tag) => (
        <Tag key={tag.id}>
          <span>{tag.value}</span>
          <Close onClick={() => removeTag(tag.id)}>
            <i className='far fa-times-circle'></i>
          </Close>
        </Tag>
      )),
    [removeTag, tags]
  );

  return (
    <Container active={active} validate={validate}>
      {tagsComp}
      <InputContainer>
        <Input
          onChange={handleChange}
          value={input}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
        />
        {!validate && <ValidateText>Check the input</ValidateText>}
      </InputContainer>
    </Container>
  );
};

const Close = styled.div`
  padding: 0;
  margin: 0;
  cursor: pointer;
  font-size: 10px;
`;
const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0;
  padding: 2px 3px;
  font-size: 12px;
  background-color: #a9a9a9;
  border-radius: 2px;

  span {
    font-weight: 600;
  }
`;

const ValidateText = styled.span`
  color: red;
  opacity: 0.7;
  position: absolute;
  top: 30px;
`;

const Input = styled.input`
  border: none;
  outline: none;
  flex: 1;
`;

const InputContainer = styled.div`
  margin: 0px;
  padding: 0px;
  position: relative;
  display: flex;
  justify-content: stretch;
  align-items: center;
  flex: 1;
`;

const Container = styled.div<{ active?: boolean; validate?: boolean }>`
  display: flex;
  justify-content: stretch;
  align-items: center;
  gap: 10px;
  margin: 0;
  padding: 5px;
  border: 1px solid #dcdcdc;
  border-radius: 2px;

  ${({ active }) => (active ? "box-shadow: 0 0 0 2px #00BFFF" : "")};
  ${({ validate }) => (!validate ? "box-shadow: 0 0 0 2px #CD5C5C" : "")};
`;

export default App;
