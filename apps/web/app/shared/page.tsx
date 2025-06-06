import {
  ClientInitializer,
  SharedTranscriptContent,
} from "@amurex/ui/components";
import { SharedTranscriptPageProps } from "@amurex/ui/types";

export default function SharedTranscriptDetail({
  params,
}: SharedTranscriptPageProps) {
  return (
    <>
      <ClientInitializer transcriptId={params.id} />
      <SharedTranscriptContent />
    </>
  );
}
