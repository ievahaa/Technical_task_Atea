import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './Questions.css';

export const Questions = ({ isUser }) => {

    const history = useHistory();

    const [userId, setUserId] = useState(0);

    const [questionId, setQuestionId] = useState(0);
    const [questionText, setQuestionText] = useState('');
    const [keyWord1, setKeyWord1] = useState('');
    const [keyWord2, setKeyWord2] = useState('');
    const [keyWord3, setKeyWord3] = useState('');

    const [answerId, setAnswerId] = useState('');
    const [answerText, setAnswerText] = useState('');

    const [allQuestions, setAllQuestions] = useState([]);
    const [searchedQuestions, setSearchedQuestions] = useState([]);

    const [showAllQuestions, setShowAllQuestions] = useState(true);

    const [currentQuestion, setCurrentQuestion] = useState('');

    const [searchQuery, setSearchQuery] = useState("");

    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [show4, setShow4] = useState(false);

    const handleClose1 = () => {
        setShow1(false);
        resetData()
    }
    const handleShow1 = () => setShow1(true);

    const handleClose2 = () => {
        setShow2(false);
        resetData()
    }
    const handleShow2 = () => setShow2(true);

    const handleClose3 = () => {
        setShow3(false);
        setAnswerText('');
    }
    const handleShow3 = () => setShow3(true);

    const handleClose4 = () => {
        setShow4(false);
        setQuestionId(0);
        setAnswerText('');
    }
    const handleShow4 = () => setShow4(true);

    useEffect(() => {
        (
            async () => {
                const response = await fetch("http://localhost:5000/api/get-all-questions");
                if (!response.ok) {
                    console.log("error loading questions");
                }

                const content = await response.json();
                setAllQuestions(content);
            }
        )();
        (
            async () => {
                const response = await fetch("http://localhost:5000/api/profile", {
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include',
                })

                const content = await response.json();
                if (parseInt(content.id) > 0) {
                    setUserId(content.id);
                }
            }
        )();
    }, [allQuestions]);

    const resetData = () => {
        setQuestionText('');
        setKeyWord1('');
        setKeyWord2('');
        setKeyWord3('');
    }

    const handleAllQuestions = () => {
        setShowAllQuestions(true);
        setSearchQuery('');
    }

    const handleAddQuestion = async(e) => {
        e.preventDefault();

        if (keyWord1 === keyWord2 || keyWord1 === keyWord3 || keyWord2 === keyWord3) {
            alert("Keywords cannot be the same!")
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/create-question", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    questionText,
                    keyWord1,
                    keyWord2,
                    keyWord3,
                    userId: parseInt(userId)
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Question created: ', result);
                handleClose1();
                resetData();
            } else {
                console.log("failed to create question", response.statusText)
            }

        } catch (e){
            console.log("error1", e.message);
        }
    }

    const handleOpenEdit = (question) => {
        setQuestionText(question.questionText);
        setKeyWord1(question.keyWord1);
        setKeyWord2(question.keyWord2);
        setKeyWord3(question.keyWord3);
        setQuestionId(question.id);
        handleShow2();
    }

    const handleEditQuestion = async(e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/update-question", {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    questionText,
                    keyWord1,
                    keyWord2,
                    keyWord3,
                    id: parseInt(questionId)
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Question created: ', result);
                handleClose2();
                resetData();
            } else {
                console.log("failed to update question", response.statusText)
            }

        } catch (e) {
            console.log("error1", e.message);
        }
    }

    const handleDeleteQuestion = async (question) => {
        if (window.confirm('Do you really want to delete \'' + question.questionText + '\'?')) {

            try {
                const response = await fetch("http://localhost:5000/api/delete-question", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: parseInt(questionId)
                    }),
                });

                if (response.ok) {
                    console.log("article deleted")
                } else {
                    const errorData = await response.json();
                    console.log("Error: ", errorData);
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        }
    }

    const handleAnswer = (question) => {
        setQuestionId(question.id);
        setCurrentQuestion(question.questionText);
        handleShow4();
    }

    const handleSaveAnswer = async() => {
        try {
            const response = await fetch("http://localhost:5000/api/create-answer", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    answerText,
                    questionId: parseInt(questionId),
                    userId: parseInt(userId)
                }),
            });

            if (response.ok) {
                setAnswerText('');
                const result = await response.json();
                console.log('Answer created: ', result);
                if (!showAllQuestions) {
                    handleSearch();
                }
                handleClose4();
            } else {
                console.log("failed to create answer", response.statusText)
            }

        } catch {
            console.log("error");
        }
    }

    const handleOpenEditAnswer = (answer) => {
        setAnswerText(answer.answerText);
        setAnswerId(answer.id);
        handleShow3();
    }

    const handleEditAnswer = async() => {
        try {
            const response = await fetch("http://localhost:5000/api/update-answer", {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    answerText,
                    id: parseInt(answerId),
                }),
            });

            if (response.ok) {
                setAnswerText('');
                const result = await response.json();
                console.log('Answer updated: ', result);
                handleClose3();
                if (!showAllQuestions) {
                    await handleSearch();
                }
            } else {
                console.log("failed to update answer", response.statusText)
            }

        } catch {
            console.log("error");
        }
    }

    const handleDeleteAnswer = async(answer) => {
        if (window.confirm('Do you really want to delete \'' + answer.answerText + '\'?')) {

            try {
                const response = await fetch("http://localhost:5000/api/delete-answer", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: parseInt(answer.id)
                    }),
                });

                if (response.ok) {
                    console.log("answer deleted")
                } else {
                    const errorData = await response.json();
                    console.log("Error: ", errorData);
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        }
    }

    const handleSearch = () => {
        setSearchedQuestions(allQuestions.filter(question =>
            question.keyWord1.toLowerCase().includes(searchQuery.toLowerCase())))
        setSearchedQuestions((prevQ) => [...prevQ, ...allQuestions.filter(question =>
            question.keyWord2.toLowerCase().includes(searchQuery.toLowerCase()))])
        setSearchedQuestions((prevQ) => [...prevQ, ...allQuestions.filter(question =>
            question.keyWord3.toLowerCase().includes(searchQuery.toLowerCase()))])

        setShowAllQuestions(false);
    }

    if (!isUser) {
        history.push('/');
    }

    return (
        <div className="questions-div">
            <h1>Questions</h1>
            <div className="top-div">
                <div className="search-div">
                    <input type="text" className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onClick={()=>setSearchedQuestions([])} placeholder="search..." /> &nbsp;
                    <Button variant="primary" onClick={handleSearch}>Search</Button>
                </div>
                <div className="forAddButton">
                    <Button variant="primary" className="addArticleButton" onClick={handleShow1}>Add Question</Button>
                </div>
            </div>
            {!showAllQuestions && (
                <div className="show-all-div">
                    <Button variant="primary" onClick={()=>handleAllQuestions() }>Show All Questions</Button>
                </div>
            )}
            {(allQuestions.length > 0 &&showAllQuestions) && (
                <>
                    {allQuestions.toReversed().map((question) => (
                        <div className="crad-div">
                            <Card>
                                <Card.Header>Keywords: {question.keyWord1} {question.keyWord2} {question.keyWord3}</Card.Header>
                                <Card.Body>
                                    <blockquote className="blockquote mb-0">
                                        <p className = "question-p">
                                            {question.questionText}
                                            {question.userId === userId && (
                                                <div className="question-btn-div">
                                                    <Button variant="link" onClick={() => handleOpenEdit(question)}>Edit</Button>
                                                    <Button variant="link" onClick={() => handleDeleteQuestion(question)}>Delete</Button>
                                                </div>
                                            ) }
                                            
                                        </p>
                                        {question.answers.map((answer, answerIndex) => (
                                            <footer className="blockquote-footer">
                                                {answer.answerText}
                                                {parseInt(userId) === parseInt(answer.userId) && (
                                                    <>
                                                        <Button variant="link" className="answer-func-btn" onClick={() => handleDeleteAnswer(answer)}>Delete</Button>
                                                        <Button variant="link" className="answer-func-btn" onClick={() => handleOpenEditAnswer(answer)}>Edit</Button>
                                                    </>
                                                ) }
                                            </footer>
                                        )) }
                                        
                                    </blockquote>
                                </Card.Body>
                                <Card.Footer>
                                    <Button onClick={() => handleAnswer(question)}>Answer to question</Button>
                                </Card.Footer>
                            </Card>
                        </div>
                    ))}
                </>
            )}

            {(allQuestions.length < 1 && showAllQuestions) && (
                <h4>No questions to show, please add a question</h4>
            )}
            {(searchedQuestions.length > 0 && !showAllQuestions) && (
                <>
                    {searchedQuestions.toReversed().map((question) => (
                        <div className="crad-div">
                            <Card>
                                <Card.Header>Keywords: {question.keyWord1} {question.keyWord2} {question.keyWord3}</Card.Header>
                                <Card.Body>
                                    <blockquote className="blockquote mb-0">
                                        <p className="question-p">
                                            {question.questionText}
                                            {question.userId === userId && (
                                                <div className="question-btn-div">
                                                    <Button variant="link" onClick={() => handleOpenEdit(question)}>Edit</Button>
                                                    <Button variant="link" onClick={() => handleDeleteQuestion(question)}>Delete</Button>
                                                </div>
                                            )}

                                        </p>
                                        {question.answers.map((answer, answerIndex) => (
                                            <footer className="blockquote-footer">
                                                {answer.answerText}
                                                {parseInt(userId) === parseInt(answer.userId) && (
                                                    <>
                                                        <Button variant="link" className="answer-func-btn" onClick={() => handleDeleteAnswer(answer)}>Delete</Button>
                                                        <Button variant="link" className="answer-func-btn" onClick={() => handleOpenEditAnswer(answer)}>Edit</Button>
                                                    </>
                                                )}
                                            </footer>
                                        ))}

                                    </blockquote>
                                </Card.Body>
                                <Card.Footer>
                                    <Button onClick={() => handleAnswer(question)}>Answer to question</Button>
                                </Card.Footer>
                            </Card>
                        </div>
                    ))}
                </>
            )}

            {(searchedQuestions.length < 1 && !showAllQuestions) && (
                <h4>There are no questions with provided keyword</h4>
            )}

            <Modal show={show1} onHide={handleClose1}>
                <Modal.Header>
                    <Modal.Title>Add Question</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Question</Form.Label>
                            <textarea className="form-control" id="questionText" name="questionText" value={questionText} onChange={e => setQuestionText(e.target.value)} rows="4" required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>KeyWord 1</Form.Label>
                            <input type="text" className="form-control" id="keyWord1" name="keyWord1" value={keyWord1} onChange={e => setKeyWord1(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>KeyWord 2</Form.Label>
                            <input type="text" className="form-control" id="keyWord2" name="keyWord2" value={keyWord2} onChange={e => setKeyWord2(e.target.value)}  />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>KeyWord 3</Form.Label>
                            <input type="text" className="form-control" id="keyWord3" name="keyWord3" value={keyWord3} onChange={e => setKeyWord3(e.target.value)}  />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose1}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddQuestion}>
                        Add Question
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show2} onHide={handleClose2}>
                <Modal.Header>
                    <Modal.Title>Edit Question</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Question</Form.Label>
                            <textarea className="form-control" id="questionText" name="questionText" value={questionText} onChange={e => setQuestionText(e.target.value)} rows="4" required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>KeyWord 1</Form.Label>
                            <input type="text" className="form-control" id="keyWord1" name="keyWord1" value={keyWord1} onChange={e => setKeyWord1(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>KeyWord 2</Form.Label>
                            <input type="text" className="form-control" id="keyWord2" name="keyWord2" value={keyWord2} onChange={e => setKeyWord2(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>KeyWord 3</Form.Label>
                            <input type="text" className="form-control" id="keyWord3" name="keyWord3" value={keyWord3} onChange={e => setKeyWord3(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose2}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleEditQuestion}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show3} onHide={handleClose3}>
                <Modal.Header>
                    <Modal.Title>Edit Answer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Answer</Form.Label>
                            <textarea className="form-control" id="answerText" name="answerText" value={answerText} onChange={e => setAnswerText(e.target.value)} rows="2" required />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose3}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleEditAnswer} disabled={!answerText}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show4} onHide={handleClose4}>
                <Modal.Header>
                    <Modal.Title>Answer to Question - {currentQuestion}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Answer</Form.Label>
                            <textarea className="form-control" id="answerText" name="answerText" value={answerText} onChange={e => setAnswerText(e.target.value)} rows="2" required />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose4}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveAnswer} disabled={!answerText}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}
