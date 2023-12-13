import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function ExerciseTooltip({
  exercise,
  children,
  ...otherTooltipProps
}) {
  // 计算还需要的运动时间和登录次数
  const remainingExerciseTime = Math.max(
    exercise.unlock_condition_exercise_time - exercise.user_exercise_time,
    0
  );
  const remainingLoginTimes = Math.max(
    exercise.unlock_condition_login_times - exercise.user_login_times,
    0
  );

  // 仅当剩余时间或登录次数大于0时，才设置tooltipTitle
  const shouldShowTooltip =
    remainingExerciseTime > 0 || remainingLoginTimes > 0;

  // Tooltip的标题文本
  const tooltipTitle = (
    <>
      {remainingExerciseTime > 0 && (
        <Typography color="inherit">
          还需运动时间：{remainingExerciseTime} 分钟
        </Typography>
      )}
      {remainingLoginTimes > 0 && (
        <Typography color="inherit">
          还需登录次数：{remainingLoginTimes} 次
        </Typography>
      )}
    </>
  );

  // Tooltip包裹任何类型的子组件
  return shouldShowTooltip ? (
    <Tooltip title={tooltipTitle} {...otherTooltipProps}>
      {children}
    </Tooltip>
  ) : (
    // 如果不需要显示Tooltip，只渲染children
    <>{children}</>
  );
}

// 使用示例，假设 popular_exercise 是一个包含必要信息的对象
const popular_exercise = {
  name: '瑜伽',
  unlock_condition_exercise_time: 300,
  user_exercise_time: 120,
  unlock_condition_login_times: 10,
  user_login_times: 5,
  duration: 120,
  popularity: 3,
};

// 渲染组件
/*
<ExerciseTooltip exercise={popular_exercise} placement="top-start">
  <Grid container item direction="column" alignItems="flex-start" justifyContent="center" xs="auto" sx={{ ml: 4 }}>
    <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5, width: 500, fontFamily: 'MSYH' }}>
      {popular_exercise.name}
    </Typography>
    <Typography variant="h5" sx={{ mt: 5, width: 500, fontFamily: 'MSYH' }}>
      {popular_exercise.duration / 60} mins
      <br/>
      {popular_exercise.popularity} times a week
    </Typography>
  </Grid>
</ExerciseTooltip>
*/
