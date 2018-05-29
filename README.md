# nQueens #
Implemented function that returns the number of solutions to the nQueens problem for a board of size n.    

## Optimizations ##

	1. Only columns on the left half of the board are explored for the first row, including the 
       middle column if n is odd. If a solution is found in a column other than the middle column, 
       the solution count is incremented by two rather than one to account for its mirrored pair 
       on the right half of the board 
	
	2. An inner recursive function proceeds row by row so that no two squares in the same 
       row may be attempted
	
	3. As the algorithm advances from row to row, the column, major and minor diagonal indexes 
       that have already been used so far in that search path are added to their respective objects 
       and are passed along to the next recursive function call. Before a queen is placed in a square, 
       the column, major and minor diagonal indexes of that square are checked against those objects 
       so that paths that cannot succeed will not be explored
	
	4. Lastly, the operation was parallelized and run across all cores of a multicore CPU which 
       further reduced the time taken to run the program
	
