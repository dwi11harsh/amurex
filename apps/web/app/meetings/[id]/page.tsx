import { MeetDetail } from "@amurex/web/components/MeetDetail";
import styles from "./TranscriptDetail.module.css";

const TranscriptDetail = ({ params }: { params: { id: string } }) => {
  return (
    <div className="min-h-screen bg-black">
      <div className="p-6 mx-auto">
        <MeetDetail styles={styles} params={params} />
      </div>
    </div>
  );
};

export default TranscriptDetail;
