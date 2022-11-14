import {
  ActionIcon,
  Group,
  Modal,
  NativeSelect,
  Tooltip,
  createStyles,
} from "@mantine/core";
import { TTSState } from "../plugins/useTextToSpeech";
import { IconVolumeOff, IconVolume, IconSettings } from "@tabler/icons";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  icon: {
    ":hover": {
      scale: "1.1",
    },
  },

  icons: {
    zIndex: 1000,
    position: "absolute",
    right: "0.5em",
    top: "0.5em",
  },

  iconSpeaking: {
    color: theme.colors.red,
  },
}));

export default function ChatSettings({
  activeVoice,
  voices,
  muted,
  ttsState,
  setMuted,
  setActiveVoice,
}: {
  activeVoice: number;
  voices: SpeechSynthesisVoice[];
  muted: boolean;
  ttsState: TTSState;
  setActiveVoice: (voice: number) => void;
  setMuted: (muted: boolean) => void;
}) {
  const [opened, setOpened] = useState(false);
  const { classes } = useStyles();
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Einstellungen"
        overlayOpacity={0.55}
        overlayBlur={2}
      >
        <NativeSelect
          value={activeVoice}
          data={voices.map((v, i) => ({
            value: `${i}`,
            label: `${v.name} ${v.lang}`,
          }))}
          label="Bevorzugte Sprache"
          description="Wähle deine bevorzugte Sprache aus"
          withAsterisk
          onChange={(e) => setActiveVoice(parseInt(e.currentTarget.value))}
        />
      </Modal>

      <Group spacing={0} className={classes.icons}>
        <Tooltip label="Einstellungen">
          <ActionIcon className={classes.icon} onClick={() => setOpened(true)}>
            <IconSettings />
          </ActionIcon>
        </Tooltip>
        <Tooltip label={muted ? "Sprache aktivieren" : "Sprache deaktivieren"}>
          <ActionIcon className={classes.icon} onClick={() => setMuted(!muted)}>
            {muted ? (
              <IconVolumeOff />
            ) : (
              <IconVolume
                className={
                  ttsState === TTSState.speaking ? classes.iconSpeaking : ""
                }
              />
            )}
          </ActionIcon>
        </Tooltip>
      </Group>
    </>
  );
}
