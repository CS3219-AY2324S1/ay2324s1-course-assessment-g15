import { useEffect, useState } from "react";
import { Box, Stack, Text, useToast } from "@chakra-ui/react";
import HistoryOverview from "../../history/HistoryOverview";
import PastAttempts from "../../history/PastAttempts";
import HistoryRequestHandler from "../../../handlers/HistoryRequestHandler";
import { Attempt, HistoryResponseString, QuestionString } from "../../../Commons";
import QuestionRequestHandler from "../../../handlers/QuestionRequestHandler";
import { showError } from "../../../Util";

const UserHistory = () => {
  const [total, setTotal] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [easy, setEasy] = useState(0);
  const [medium, setMedium] = useState(0);
  const [hard, setHard] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  function getUniqueQuestions(value: HistoryResponseString) {
    let arr = value.attempts.map(x => x.questionId);
    arr = arr.filter((value, index) => arr.indexOf(value) === index);
    return arr.filter(value => value !== undefined);
  }

  useEffect(() => {
    HistoryRequestHandler.getHistory()
      .then((r) => {
        QuestionRequestHandler.getQuestionsCount().then(total => setTotal(total));
        let uniqueQuestions = getUniqueQuestions(r)
        setAttempted(uniqueQuestions.length);
        QuestionRequestHandler.loadQuestions().then((qns) => {
          if (qns.length === 0) {
            return;
          }

          function setComplexity(setter: React.Dispatch<React.SetStateAction<number>>,
            complexity: string) {
            setter(qns.filter(x => x.complexity === complexity)
              .map(value => uniqueQuestions.includes(value.id))
              .filter(x => x).length)
          }
          setComplexity(setEasy, 'Easy');
          setComplexity(setMedium, 'Medium');
          setComplexity(setHard, 'Hard');

          let updatedAttempts = r.attempts.map((entry) => {
            let title = "Question does not exist anymore";
            let filtered = qns.filter((q) => q.id === entry.questionId)[0];
            if (filtered !== undefined) {
              title = filtered.title;
            }
            return {
              questionId: title,
              timestamp: entry.timestamp
            }
          });
          setAttempts(updatedAttempts);
        });
      }).catch(e => {
        const toast = useToast();
        showError((e as Error).message, toast)
      });
  }, []);


  return (
    <Box>
      <Stack>
        <Box pb={2} >
          <Text textStyle='h1' color='primary.blue4'>
            Your Statistics
          </Text>
        </Box>
        <HistoryOverview
          total={total}
          attempted={attempted}
          easy={easy}
          medium={medium}
          hard={hard}
        />
        <Stack maxH={400} overflowY={'auto'}>
          <Box pb={2} pt={5} >
            <Text textStyle='h1' color='primary.blue4'>
              Your Attempts
            </Text>
          </Box>
          {attempted > 0 && <PastAttempts attempts={attempts} />}
          {attempted === 0 && <Text>No Past attempts!</Text>}
        </Stack>
      </Stack>
    </Box >
  );
}

export default UserHistory;
