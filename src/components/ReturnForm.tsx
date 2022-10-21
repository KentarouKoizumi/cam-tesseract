import { useContext, useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button } from '@mui/material';
import { LinearProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';
import _typeLendingList from '../../lib/typeLendingList.json';
import axios, { AxiosResponse, AxiosError } from "axios";
import { StudentIdContext, LendingListContext, IsPostingNowContext } from '../App';

type typeLendingList = typeof _typeLendingList;
const makeIsLendingNowFalseURL = "https://asia-northeast1-lounge-library.cloudfunctions.net/makeIsLendingNowFalse";


export default function RetrunForm () {

  const { studentId, isStudentIdValid, studentIdOnChangeHandler } = useContext(StudentIdContext)
  const { lendingList } = useContext(LendingListContext)
  const { isPostingNow, setIsPostingNow} = useContext(IsPostingNowContext)
  const [ isBookGoingToBeReturned, setIsBookGoingToBeReturned ] = useState<{[key:string]:boolean}>({})

  useEffect(() => {
    const lendingListByStudentId = lendingList.filter((lending) => lending.studentId === studentId)
    var newRetrunableList: {[key:string]:boolean}= {}
    lendingListByStudentId.forEach((lending) => {
      newRetrunableList[lending.lendingDatetime] = false
    })
    setIsBookGoingToBeReturned(newRetrunableList)
  }, [studentId, lendingList])


  const returnBook = async () => {
    const returnInfo = Object.keys(isBookGoingToBeReturned).filter((key) => isBookGoingToBeReturned[key])
    console.log(returnInfo)
    // setIsPostingNow(true)
    // const request = await axios.post<typeLendingList>(makeIsLendingNowFalseURL, {returnInfo})
    //   .then((response: AxiosResponse) => {
    //   console.log(response)
    //   setIsPostingNow(false);
    // }).catch((error: AxiosError) => {
    //   console.log(error)
    //   setIsPostingNow(false);
    // })
  }
  const checkboxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lendingDatetime = e.target.name
    console.log({...isBookGoingToBeReturned, [lendingDatetime]: e.target.checked})
    setIsBookGoingToBeReturned({...isBookGoingToBeReturned, [lendingDatetime]: e.target.checked})
  }


  return (
      <>
        <TextField
          value={studentId}
          label="学籍番号"
          onChange={studentIdOnChangeHandler}
          error={studentId.length !== 0 && !isStudentIdValid}
        ></TextField>
        <Button
          variant="contained"
          onClick={returnBook}
          disabled={isPostingNow}
        >
          返却
        </Button>
        {
          isPostingNow ? (
            <LinearProgress />
          ) : (
            <></>
          )
        }
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>返却</TableCell>
                <TableCell>貸出日</TableCell>
                {/* <TableCell>学籍番号</TableCell> */}
                {/* <TableCell>ISBN</TableCell> */}
                <TableCell>タイトル</TableCell>
                <TableCell>著者</TableCell>
                <TableCell>貸出状況</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lendingList.map((row) => (
                <>
                { row.studentId === studentId &&
                  <TableRow
                  key={row.lendingDatetime}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  <TableCell>
                    <Checkbox name={row.lendingDatetime} checked={isBookGoingToBeReturned[row.lendingDatetime] !== undefined ? false : isBookGoingToBeReturned[row.lendingDatetime]} onChange={ checkboxHandler } />
                  </TableCell>
                    <TableCell >{row.lendingDatetime}</TableCell>
                    {/* <TableCell >{row.studentId}</TableCell> */}
                    {/* <TableCell component="th" scope="row">{row.bookIsbn}</TableCell> */}
                    <TableCell >{row.bookTitle}</TableCell>
                    <TableCell >{row.bookAuthors.join(", ")}</TableCell>
                    {
                      row.isLendingNow ? (
                        <TableCell>貸出中</TableCell>
                      ) : (
                        <TableCell>返却済み</TableCell>
                      )
                    }
                  </TableRow>
                }
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </>
  )
}