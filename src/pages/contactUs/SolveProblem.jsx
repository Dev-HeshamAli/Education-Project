import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Alert,
  TextField,
  Collapse,
  Avatar,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchProblems } from "../../store/shared/problems/actGetProblems";
import { fetchSolvedProblems } from "../../store/shared/solvedProblems/actGetSolvedProblems";
import { actDeleteProblem } from "../../store/problemsForAdmin/deleteProblem/actDeleteProblem";
import { actSolveProblem } from "../../store/problemsForAdmin/solveProblem/actSolveProblem";
import { clearMessageSolveProblem } from "../../store/problemsForAdmin/solveProblem/solveProblemSlice";
import { clearMessageDeleteProblem } from "../../store/problemsForAdmin/deleteProblem/deleteProblemSlice";

const SolveProblem = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [problems, setProblems] = useState([]);
  const [solvedList, setSolvedList] = useState([]);

  const {
    success: deleteSuccess,
    error: deleteError,
    loading: deleteLoading,
  } = useSelector((state) => state.deleteProblem);
  const {
    success: updateSuccess,
    error: updateError,
    loading: updateLoading,
  } = useSelector((state) => state.solveProblem);

  const [showSolved, setShowSolved] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [responseText, setResponseText] = useState("");

  // pop-up state
  const [problemDialogOpen, setProblemDialogOpen] = useState(false);
  const [fullProblemText, setFullProblemText] = useState("");

  // delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchProblems(token)).then((res) => {
      if (res?.payload) setProblems(res.payload);
    });
    dispatch(fetchSolvedProblems(token)).then((res) => {
      if (res?.payload) setSolvedList(res.payload);
    });
  }, [dispatch, token]);

  const confirmDelete = (problem) => {
    setProblemToDelete(problem);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!problemToDelete) return;

    setProblems((prev) => prev.filter((p) => p.id !== problemToDelete.id));

    dispatch(actDeleteProblem({ token, id: problemToDelete.id })).then(
      (res) => {
        if (res.error) {
          setProblems((prev) => [...prev, problemToDelete]);
        }
      }
    );

    setDeleteDialogOpen(false);
    setProblemToDelete(null);
  };

  const handleReplyClick = (problem) => {
    setSelectedProblem(problem);
    setResponseText("");
    setReplyOpen(true);
  };

  const handleSendReply = () => {
    if (!selectedProblem) return;
    dispatch(
      actSolveProblem({
        token,
        data: {
          id: selectedProblem.id,
          response: responseText,
          email: selectedProblem.userEmail,
        },
      })
    ).then((res) => {
      if (!res.error) {
        setProblems((prev) => prev.filter((p) => p.id !== selectedProblem.id));
        setSolvedList((prev) => [
          ...prev,
          { ...selectedProblem, response: responseText },
        ]);
      }
    });
    setReplyOpen(false);
    setSelectedProblem(null);
    setResponseText("");
  };

  const openProblemDialog = (fullText) => {
    setFullProblemText(fullText);
    setProblemDialogOpen(true);
  };

  useEffect(() => {
    if (updateSuccess || updateError || deleteSuccess || deleteError) {
      const timer = setTimeout(() => {
        dispatch(clearMessageSolveProblem());
        dispatch(clearMessageDeleteProblem());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, updateError, deleteSuccess, deleteError, dispatch]);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Unsolved Problems
      </Typography>

      {deleteSuccess && (
        <Alert sx={{ m: 2 }} severity="success">
          {deleteSuccess}
        </Alert>
      )}
      {deleteError && (
        <Alert sx={{ m: 2 }} severity="error">
          {deleteError}
        </Alert>
      )}
      {updateSuccess && (
        <Alert sx={{ m: 2 }} severity="success">
          {updateSuccess}
        </Alert>
      )}
      {updateError && (
        <Alert sx={{ m: 2 }} severity="error">
          {updateError}
        </Alert>
      )}

      <Paper elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Photo</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Problem</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {problems?.map((p, index) => (
              <TableRow key={p.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Avatar src={p.photo || undefined}>
                    {!p.photo && p.userName?.[0]}
                  </Avatar>
                </TableCell>
                <TableCell>{p.userName}</TableCell>
                <TableCell>{p.userEmail}</TableCell>
                <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
                <TableCell
                  sx={{ cursor: "pointer", color: "blue" }}
                  onClick={() => openProblemDialog(p.problem)}
                >
                  {p.problem.length > 20
                    ? p.problem.substring(0, 18) + "..."
                    : p.problem}
                </TableCell>
                <TableCell>
                  <Button
                    color="error"
                    onClick={() => confirmDelete(p)}
                    disabled={deleteLoading}
                    variant="outlined"
                    sx={{ mr: 2 }}
                  >
                    Delete
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => handleReplyClick(p)}
                    disabled={updateLoading}
                    variant="outlined"
                  >
                    Reply
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Dialog to show full problem */}
      <Dialog
        open={problemDialogOpen}
        onClose={() => setProblemDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Full Problem</DialogTitle>
        <DialogContent>
          <Typography>{fullProblemText}</Typography>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this message?</Typography>
          <Box mt={2} display="flex" gap={2}>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
            >
              Yes, Delete
            </Button>
            <Button
              variant="outlined"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Collapse in={replyOpen}>
        <Box mt={3} p={2} border="1px solid #ddd" borderRadius={2}>
          <Typography variant="h6" mb={2}>
            Reply to Problem
          </Typography>
          <TextField
            label="Email"
            value={selectedProblem?.userEmail || ""}
            fullWidth
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            label="Response"
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleSendReply}>
            Send Reply
          </Button>
        </Box>
      </Collapse>

      <Box mt={4}>
        <Button
          variant="outlined"
          onClick={() => setShowSolved((prev) => !prev)}
          sx={{ mb: 2 }}
        >
          {showSolved ? "Hide Solved Messages" : "Show Solved Messages"}
        </Button>
        <Collapse in={showSolved}>
          <Typography variant="h5" mb={2}>
            Solved Problems
          </Typography>
          <Paper elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Photo</TableCell>
                  <TableCell>User Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Response</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {solvedList?.map((p, index) => (
                  <TableRow key={p.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Avatar src={p.photo || undefined}>
                        {!p.photo && p.userName?.[0]}
                      </Avatar>
                    </TableCell>
                    <TableCell>{p.userName}</TableCell>
                    <TableCell>{p.userEmail}</TableCell>
                    <TableCell>
                      {new Date(p.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell
                      sx={{ cursor: "pointer", color: "blue" }}
                      onClick={() => openProblemDialog(p.problem)}
                    >
                      {p.problem.length > 20
                        ? p.problem.substring(0, 20) + "..."
                        : p.problem}
                    </TableCell>
                    <TableCell>{p.response}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Collapse>
      </Box>
    </Box>
  );
};

export default SolveProblem;
