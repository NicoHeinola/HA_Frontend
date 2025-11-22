import { useDialog } from "@/components/use-dialog/useDialog";
import PromptDialog from "@/components/use-dialog/prompt/PromptDialog.vue";

export function usePrompt() {
  const openDialog = useDialog();

  const openPrompt = async (options?: any): Promise<string | null> => {
    const result = await openDialog({
      component: PromptDialog,
      props: options?.props || {},
    });

    return result;
  };

  return { openPrompt };
}
