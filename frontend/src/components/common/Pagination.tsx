/**
 * Pagination 컴포넌트
 * - 역할: 페이지 네비게이션 UI 제공
 * - 기능: 이전/다음 버튼, 페이지 번호 표시, 첫/마지막 페이지 바로가기
 * - 알고리즘: 최대 5개 버튼, 현재 페이지 중심 배치
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // 페이지 범위 계산
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5; // 최대 보여줄 페이지 버튼 수

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    // 끝에서 부족한 경우 start 조정
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* 이전 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        이전
      </button>

      {/* 첫 페이지 */}
      {pages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            1
          </button>
          {pages[0] > 2 && <span className="px-2">...</span>}
        </>
      )}

      {/* 페이지 번호들 */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-md border ${
            currentPage === page
              ? "bg-primary text-white border-primary"
              : "border-gray-300 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      {/* 마지막 페이지 */}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-2">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 다음 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        다음
      </button>
    </div>
  );
}
