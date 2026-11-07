/**
 * BAKUWIRA: Central Educational Activity Dispatcher
 * Dispatches all 21 mission activity types to their specialized interactive runners.
 */

import React from 'react';
import { MissionQuestion } from '../../types/game';
import { WordHighlightMatchActivity } from './WordHighlightMatchActivity';
import { MatchingActivity } from './MatchingActivity';
import { WordOrderActivity } from './WordOrderActivity';
import { IntegratedFinalActivity } from './IntegratedFinalActivity';
import { QuizActivity } from './QuizActivity';
import { WritingActivity } from './WritingActivity';
import { SpeechActivity } from './SpeechActivity';
import { NPCDialogueActivity } from './NPCDialogueActivity';
import { ExplorationActivity } from './ExplorationActivity';

interface ActivityDispatcherProps {
  question: MissionQuestion;
  clueId?: string;
  onComplete: (score: number, passed: boolean) => void;
  onClose: () => void;
}

export const ActivityDispatcher: React.FC<ActivityDispatcherProps> = ({
  question,
  clueId,
  onComplete,
  onClose,
}) => {
  // 1. Misi 01 / Word Highlight Match
  if (question.activityType === 'word_highlight_match' || question.id === 'BW-M01') {
    return <WordHighlightMatchActivity question={question} onComplete={onComplete} onClose={onClose} />;
  }

  // 2. Misi 09 / Word Order
  if (question.activityType === 'word_order' || question.id === 'BW-M09') {
    return <WordOrderActivity question={question} onComplete={onComplete} onClose={onClose} />;
  }

  // 3. Misi 07 & Misi 11 / Matching
  if (question.activityType === 'matching' || question.id === 'BW-M07' || question.id === 'BW-M11') {
    return <MatchingActivity question={question} onComplete={onComplete} onClose={onClose} />;
  }

  // 4. Misi 21 / Integrated Final Challenge
  if (question.activityType === 'integrated_final' || question.id === 'BW-M21') {
    return <IntegratedFinalActivity question={question} onComplete={onComplete} onClose={onClose} />;
  }

  // 5. Quiz (Single Choice or Multiple Choice - Misi 02, Misi 06)
  if (
    question.activityType === 'single_choice' ||
    question.activityType === 'multiple_choice' ||
    question.activityType === 'kuiz_interaktif' ||
    question.id === 'BW-M02' ||
    question.id === 'BW-M06'
  ) {
    return <QuizActivity question={question} onComplete={onComplete} onClose={onClose} />;
  }

  // 6. Writing Challenges (Misi 03, Misi 05, Misi 10, Misi 12, Misi 17, Misi 18)
  if (
    question.activityType === 'writing_rewrite' ||
    question.activityType === 'investigation_writing' ||
    question.activityType === 'writing_message' ||
    question.activityType === 'writing_announcement' ||
    question.activityType === 'writing_invitation' ||
    question.activityType === 'cabaran_penulisan' ||
    ['BW-M03', 'BW-M05', 'BW-M10', 'BW-M12', 'BW-M17', 'BW-M18'].includes(question.id)
  ) {
    return <WritingActivity question={question} onComplete={onComplete} onClose={onClose} />;
  }

  // 7. Speech Challenges (Misi 04, Misi 13, Misi 14, Misi 15, Misi 16, Misi 19, Misi 20)
  if (
    question.activityType === 'speaking_announcement' ||
    question.activityType === 'speaking_npc' ||
    question.activityType === 'speaking_transaction' ||
    question.activityType === 'speaking_interview' ||
    question.activityType === 'speaking_forum' ||
    question.activityType === 'speaking_speech' ||
    question.activityType === 'simulasi_pertuturan' ||
    ['BW-M04', 'BW-M13', 'BW-M14', 'BW-M15', 'BW-M16', 'BW-M19', 'BW-M20'].includes(question.id)
  ) {
    return <SpeechActivity question={question} onComplete={onComplete} onClose={onClose} />;
  }

  // 8. NPC Dialogue (Misi 08)
  if (question.activityType === 'npc_dialogue' || question.activityType === 'simulasi_npc' || question.id === 'BW-M08') {
    return <NPCDialogueActivity question={question} onComplete={onComplete} onClose={onClose} />;
  }

  // 9. Exploration Clues Fallback
  return (
    <ExplorationActivity
      question={question}
      clueId={clueId}
      onComplete={onComplete}
      onClose={onClose}
    />
  );
};
