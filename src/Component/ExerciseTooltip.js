import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function ExerciseTooltip({
  exercise,
  children,
  ...otherTooltipProps
}) {
  // Calculate the amount of exercise time and number of logins still needed
  const remainingExerciseTime = Math.max(
    exercise.unlock_condition_exercise_time - exercise.user_exercise_time,
    0
  );
  const remainingLoginTimes = Math.max(
    exercise.unlock_condition_login_times - exercise.user_login_times,
    0
  );

  const shouldShowTooltip =
    remainingExerciseTime > 0 || remainingLoginTimes > 0;

  const tooltipTitle = (
    <>
      {remainingExerciseTime > 0 && (
        <Typography color="inherit">
         Additional exercise time required: {remainingExerciseTime} minutes
        </Typography>
      )}
      {remainingLoginTimes > 0 && (
        <Typography color="inherit">
         Additional Login times required: {remainingLoginTimes} times
        </Typography>
      )}
    </>
  );

  return shouldShowTooltip ? (
    <Tooltip title={tooltipTitle} {...otherTooltipProps}>
      {children}
    </Tooltip>
  ) : (
    <>{children}</>
  );
}
