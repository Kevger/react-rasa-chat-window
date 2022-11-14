import { createStyles, Group, Paper } from "@mantine/core";
import { RasaMessage } from "../../../Plugins/useRasa";

const useStyles = createStyles((theme) => {
  return {
    textmessage: {
      position: "relative",
    },
    comment: {
      padding: `${theme.spacing.sm}px ${theme.spacing.sm}px`,
      maxWidth: "80%",
      boxShadow: theme.shadows.sm,
    },
  };
});

export default function TextMessage({ message }: { message: RasaMessage }) {
  const { classes } = useStyles();

  return (
    <Group position={message.received ? "left" : "right"}>
      <Paper withBorder radius="md" className={classes.comment}>
        {message.text}
      </Paper>
    </Group>
  );
}
