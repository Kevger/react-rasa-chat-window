import { TextInput, ActionIcon, useMantineTheme } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons";
import { useState } from "react";
import SpeechToText from "../../../Components/Speech/SpeechToText";

export default function ChatInput({
  onSubmit,
}: {
  onSubmit: CallableFunction;
}) {
  const theme = useMantineTheme();
  const [input, setInput] = useState("");
  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(input);
    setInput("");
  };
  const handleSpeechSubmit = (text: string) => {
    onSubmit(text);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        icon={
          <SpeechToText
            onInput={handleSpeechSubmit}
            onChange={(text) => setInput(text)}
          />
        }
        radius="xl"
        size="md"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rightSection={
          <ActionIcon
            size={32}
            radius="xl"
            color={theme.primaryColor}
            variant="filled"
            type="submit"
          >
            <IconArrowRight size={18} stroke={1.5} />
          </ActionIcon>
        }
        placeholder="Frag etwas!"
        rightSectionWidth={42}
      />
    </form>
  );
}
