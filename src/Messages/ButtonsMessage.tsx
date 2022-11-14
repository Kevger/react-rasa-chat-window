import { Button, createStyles, Group } from "@mantine/core";
import { RasaMessage } from "../../../Plugins/useRasa";

const useStyles = createStyles((theme) => {
  return {
    button: {
      backgroundColor: theme.colors.gray[4],
      boxShadow: theme.shadows.xl,
      ":hover": {
        scale: "1.1",
      },
      ":disabled": {
        opacity: 0.5,
        scale: "0.8",
      },
    },
  };
});

export default function ButtonsMessage({ message }: { message: RasaMessage }) {
  const { classes } = useStyles();
  return (
    <Group>
      {message.quick_replies?.map((m, i) => (
        <Button
          px={10}
          onClick={m.onClick}
          disabled={message.clicked}
          className={classes.button}
          key={`${message.id} b: ${i}`}
          style={m.clicked ? { backgroundColor: "red", scale: "1.1" } : {}}
        >
          {m.title}
        </Button>
      ))}
    </Group>
  );
}
