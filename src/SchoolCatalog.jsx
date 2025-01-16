import { useState, useEffect } from 'react';

const PAGE_SIZE = 5;

export default function SchoolCatalog() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [ascending, setAscending] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses.json');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleSort = (column) => {
    if (sortBy === column) {
      setAscending(!ascending);
    } else {
      setSortBy(column);
      setAscending(true);
    }
  };

  const filteredCourses = courses.filter(course => {
    const searchLower = searchTerm.toLowerCase();
    return course.courseNumber.toLowerCase().includes(searchLower) ||
           course.courseName.toLowerCase().includes(searchLower);
  }).sort((a, b) => {
    if (!sortBy) return 0;
    const multiplier = ascending ? 1 : -1;
    return multiplier * a[sortBy].toString().localeCompare(b[sortBy].toString());
  });

  const currentPageCourses = filteredCourses.slice(
    (page - 1) * PAGE_SIZE, 
    page * PAGE_SIZE
  );

  const hasMore = filteredCourses.length > page * PAGE_SIZE;
  const hasLess = page > 1;

  // couldn't figure out how to drop courses in time

  return (
    <div className="school-catalog">
      <h1>School Catalog</h1>
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('trimester')} style={{cursor: 'pointer'}}>Trimester</th>
            <th onClick={() => handleSort('courseNumber')} style={{cursor: 'pointer'}}>Course Number</th>
            <th onClick={() => handleSort('courseName')} style={{cursor: 'pointer'}}>Courses Name</th>
            <th onClick={() => handleSort('semesterCredits')} style={{cursor: 'pointer'}}>Semester Credits</th>
            <th onClick={() => handleSort('totalClockHours')} style={{cursor: 'pointer'}}>Total Clock Hours</th>
            <th>Enroll</th>
          </tr>
        </thead>
        <tbody>
          {currentPageCourses.map((course) => (
            <tr key={course.courseNumber}>
              <td>{course.trimester}</td>
              <td>{course.courseNumber}</td>
              <td>{course.courseName}</td>
              <td>{course.semesterCredits}</td>
              <td>{course.totalClockHours}</td>
              <td>
                <button>Enroll</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button 
          disabled={!hasLess} 
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <button 
          disabled={!hasMore} 
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}