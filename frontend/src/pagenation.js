import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination, Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function PaginationComponent({ user }) {

    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const formatDateTime = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);
        const year = dateTime.getFullYear();
        const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
        const day = dateTime.getDate().toString().padStart(2, '0');
        const hour = dateTime.getHours() > 12 ? (dateTime.getHours() - 12).toString().padStart(2, '0') : dateTime.getHours().toString().padStart(2, '0');
        const minute = dateTime.getMinutes().toString().padStart(2, '0');
        const ampm = dateTime.getHours() >= 12 ? '오후' : '오전';
        
        return `${year}-${month}-${day} | ${ampm} ${hour}:${minute}`;
    };

    useEffect(() => {
        fetchPosts();
        if (user !== null) {
            console.log("User:", user.name);
        }
    }, [currentPage, user]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/post2?page=${currentPage}`);
            const formattedPosts = response.data.post.map(post => ({
                ...post,
                created_at: formatDateTime(post.created_at)
            }));
            setPosts(formattedPosts);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('게시물을 불러오는데 실패했습니다.', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handletoPost = () => {
        navigate('/post');
    };

    const handletoHome = () => {
        navigate('/home');
    };

    const handleEditPost = (post_id) => {
        navigate(`/postedit?post_id=${post_id}`);
    };

    const handleCardClick = (post_id) => {
        navigate(`/postread?post_id=${post_id}`);
    };

    const handleDeletePost = async (post_id, author_name) => {
        if (user.name === author_name) {
            try {
                await axios.delete(`http://localhost:8081/post/${post_id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                fetchPosts();
            } catch (error) {
                console.error('게시물 삭제에 실패했습니다.', error);
            }
        } else {
            console.log('해당 게시물을 삭제할 권한이 없습니다.');
        }
    };

    return (
        <div className="container mt-2">
            <h2 className="text-center mb-4 mt-4" style={{ whiteSpace: 'nowrap' }}>게시물 목록</h2>
            <Table striped bordered hover style={{ whiteSpace: 'nowrap' }}>
                <thead>
                    <tr>
                        <th style={{ width: '4%' }}>번호</th>
                        <th style={{ width: '32%' }}>제목</th>
                        <th style={{ width: '20%' }}>작성자</th>
                        <th style={{ width: '30%' }}>작성일자</th>
                        <th style={{ width: '4%' }}>조회수</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post) => (
                        <tr key={post.post_id}>
                            <td style={{ whiteSpace: 'nowrap' }} className="text-center" >{post.post_id}</td>
                            <td style={{ whiteSpace: 'nowrap' }} onClick={() => handleCardClick(post.post_id)}>{post.title}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{post.author_name}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{post.created_at}</td>
                            <td style={{ whiteSpace: 'nowrap' }} className="text-center">{post.views}</td>
                            <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                {user && user.name === post.author_name && (
                                    <>
                                        <Button variant="primary" size="sm" className="me-1" onClick={(e) => {e.stopPropagation(); handleEditPost(post.post_id); }}>수정</Button>
                                        <Button variant="danger" size="sm" className="me-1" onClick={(e) => {e.stopPropagation(); handleDeletePost(post.post_id, post.author_name); }}>삭제</Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="pagination d-flex justify-content-center mt-4"style={{ whiteSpace: 'nowrap' }}>
                <Pagination style={{ whiteSpace: 'nowrap' }}>
                    <Pagination.Prev disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} />
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item key={index + 1} active={currentPage === index + 1} onClick={() => handlePageChange(index + 1)}>
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} />
                </Pagination>
                
            </div>

            <div className="d-flex justify-content-end mb-4" style={{ whiteSpace: 'nowrap' }}>
                <button className="btn btn-primary me-2" onClick={handletoPost}>게시글 작성</button>
                <button className="btn btn-secondary" onClick={handletoHome}>Home</button>
            </div>
        </div>
    );
}

export default PaginationComponent;
