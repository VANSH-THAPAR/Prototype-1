/fetch-total :- (get) :- json({
    totalStudents : countStudent,
    totalAlumni : countAlumni
})

/add-alumni :- (post) :- add alumni according to alumni schema