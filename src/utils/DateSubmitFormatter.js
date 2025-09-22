import { format } from 'date-fns';

const convertToSubmitFormat = (dateString) => {
    const parsedDate = new Date(dateString);
    const mysqlLikeFormat = format(parsedDate, 'yyyy-MM-dd');
    return mysqlLikeFormat;
};

export { convertToSubmitFormat };