/** @format */

import * as React from "react";
import styled from "styled-components";

interface IProps {
  tagRegex?: RegExp;
}
interface TagInfo {
  id: number;
  value: string;
}

const App: React.FC<IProps> = ({ tagRegex = /^[\d]+$/ }) => {
  const [tags, setTags] = React.useState<TagInfo[]>([]);
  const [input, setInput] = React.useState<string>("");
  const [validate, setValidate] = React.useState<boolean>(true);

  const tagsComp = React.useMemo(
    () =>
      tags.map((tag) => (
        <Tag key={tag.id}>
          <span>{tag.value}</span>
          <Close onClick={() => removeTag(tag.id)} />
        </Tag>
      )),
    [tags]
  );

  const updateTags = React.useCallback(() => {
    // validate input data
    if (input !== "") {
      console.log(input);
      if (tagRegex.test(input)) {
        setTags([...tags, { id: Date.now(), value: input }]);
        setInput("");
        setValidate(true);
      } else {
        setValidate(false);
      }
    }
  }, [input, tags, setValidate]);

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
      if (event.key === "Enter" || event.key === "Tab" || event.key === " ") {
        event.preventDefault();
        updateTags();
      } else if (event.key === "Backspace" && input === "") {
        event.preventDefault();
        removeTag(tags[tags.length - 1].id);
      }
    },
    [updateTags, input]
  );

  return (
    <Container>
      {tagsComp}
      <InputContainer>
        <Input
          onChange={handleChange}
          value={input}
          onBlur={updateTags}
          onKeyDown={handleKeyDown}
        />
        {!validate && <ValidateText>Check the input</ValidateText>}
      </InputContainer>
    </Container>
  );
};

const Close = styled.div`
  padding: 0;
  margin: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  background-color: red;
  color: white;
  cursor: pointer;
`;
const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0;
  padding: 5px 10px;
  background-color: #808080;
  color: white;
  font-weight: 500;
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
const Container = styled.div`
  display: flex;
  justify-content: stretch;
  align-items: center;
  gap: 10px;
  margin: 0;
  padding: 5px;
  border: 1px solid #f2f2f2;
`;

export default App;
