import { useEffect, useState } from "react";
import { Box, Stack, Text, filter } from "@chakra-ui/react";
import HistoryOverview from "../../history/HistoryOverview";
import PastAttempts from "../../history/PastAttempts";
import HistoryRequestHandler from "../../../handlers/HistoryRequestHandler";
import { Attempt, HistoryResponseString } from "../../../Commons";
import QuestionRequestHandler from "../../../handlers/QuestionRequestHandler";

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
        console.log(r);
        QuestionRequestHandler.getQuestionsCount().then(total => setTotal(total));
        let uniqueQuestions = getUniqueQuestions(r)
        setAttempted(uniqueQuestions.length);
        QuestionRequestHandler.loadQuestions().then((qns) => {
          setEasy(qns.filter(x => x.complexity === 'Easy')
            .map(value => uniqueQuestions.includes(value.id))
            .filter(x => x).length)
          setMedium(qns.filter(x => x.complexity === 'Medium')
            .map(value => uniqueQuestions.includes(value.id))
            .filter(x => x).length)
          setHard(qns.filter(x => x.complexity === 'Hard')
            .map(value => uniqueQuestions.includes(value.id))
            .filter(x => x).length)
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
        console.log((e as Error).message);
      });
  }, []);


  return (
    <Box>
      <Stack>
        <Box pb={3} borderBottom={'1px solid #999'} mb={3}>
          <Text fontSize={24}>
            Attempts Overview
          </Text>
        </Box>
        <HistoryOverview
          total={total}
          attempted={attempted}
          easy={easy}
          medium={medium}
          hard={hard}
        />
        <Stack>
          <Box pb={3} pt={5} borderBottom={'1px solid #999'} mb={3}>
            <Text fontSize={24}>
              Recent Attempts
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
