import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import history from '../Tool/history';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function UnlockNewActivityDialog(props) {
  const { setTopage, setPath, exercisesList } = props;

  const [open, setOpen] = useState(false);
  const [newlyUnlockedExercise, setNewlyUnlockedExercise] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };
  const goToNewExercise = () => {
    const id = newlyUnlockedExercise.id;
    const path = `/Working_Yoga?exercise=${id}`;
    setPath(path);
    history.push({
      pathname: path,
      state: {},
    });
    setTopage('Working_Yoga');
    setOpen(false);
  };
  useEffect(() => {
    /**
     * description of requirements:
     * "unlock" 有三个可能值，"lock"：user 未达到解锁条件，“unlock": 已经解锁， “new_unlock": user 刚刚满足解锁条件，这个时候需要提示 user 这个 exercise 已经解锁了
     */
    // 检查是否有新解锁的运动项目
    const newUnlock = exercisesList.find(
      (exercise) => exercise.unlock === 'new_unlock'
      // (exercise) => exercise.unlock === 'unlock'
    );
    if (newUnlock) {
      setNewlyUnlockedExercise(newUnlock);
      setOpen(true);
    }
  }, [exercisesList]);
  return (
    <React.Fragment>
      <BootstrapDialog
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth={'lg'}
      >
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          fontSize="small"
          id="customized-dialog-title"
        >
          恭喜您解锁新运动项目！
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        {newlyUnlockedExercise && (
          <DialogContent>
            {/* 可以在这里添加图片或图标 */}
            <DialogContentText>
              <Typography gutterBottom>
                您已解锁：{newlyUnlockedExercise.name}
              </Typography>
              {newlyUnlockedExercise.description ? (
                <Typography gutterBottom>
                  简介：{newlyUnlockedExercise.description}
                </Typography>
              ) : null}
              <Typography gutterBottom>
                持续时间：{newlyUnlockedExercise.duration} 秒
              </Typography>
              <Typography gutterBottom>
                消耗卡路里：{newlyUnlockedExercise.calories}
              </Typography>
            </DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={handleClose}>关闭</Button>
          <Button
            autoFocus
            variant="contained"
            size="small"
            color="error"
            onClick={goToNewExercise}
          >
            前往新运动
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
