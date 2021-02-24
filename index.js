const express = require("express");
const app = express();

app.use(express.json());
app.listen(3000);


students = [{sid:1,name:"Sharan",hasMentor:false},{sid:2,name:"Mahesh",hasMentor:true,tid:1},{sid:3,name:"Anand",hasMentor:true,tid:2},{sid:4,name:"Netam",hasMentor:false},{sid:5,name:"Ribhav",hasMentor:true,tid:1},{sid:6,name:"Shreyansh",hasMentor:false}];
mentors = [{tid:1,name:"Rakesh",studentids:[2,5]},{tid:2,name:"Venkatesh",studentids:[3]}];

app.get('/students',(req,res)=>{
    res.send(students);
})

app.get('/mentors',(req,res)=>{
    res.send(mentors);
})

app.post('/student/:sid',(req,res)=>{
    sid = req.params.sid;
    object = req.body;
    students.push(object);
    if(object.hasMentor==true)
    {
        tid = object.tid;
        index = mentors.findIndex((m)=>{
            return m.tid==tid;
        })
        mentors[index].studentids.push(parseInt(sid));
    }
    res.status(200).json({"content":"Success"});
})

app.post('/mentors/:tid',(req,res)=>{
    tid = req.params.tid;
    object = req.body;
    mentors.push(object);
    res.status(200).json({"content":"Success"});
})

app.delete('/student/:sid',(req,res)=>{
    sid = req.params.sid;
    sindex = students.findIndex((s)=>{
        return s.sid == sid;
    });
    students.splice(sindex,1);
    mentors.forEach((mentor)=>{
        mindex = mentor.studentids.findIndex((msid)=>{
            return msid == sid;
        })
        if(mindex!=-1)
        {
            mentor.studentids.splice(mindex,1);
        }
    });
    res.status(200).json({"content":"Success"});
})


app.delete('/mentor/:tid',(req,res)=>{
    tid = req.params.tid;
    index = mentors.findIndex((m)=>{
        return m.tid == tid;
    });
    mentors[index].studentids.forEach((id)=>{
        sindex = students.findIndex((s)=>{
            return s.sid==id;
        })
        if(sindex!=-1)
        {
            students[sindex].hasMentor = false;
            delete students[sindex].tid;
        }
    });
    mentors.splice(index,1);
    res.status(200).json({"content":"Success"});
})

app.get('/mentor/:tid',(req,res)=>{
    tid = req.params.tid;
    index = mentors.findIndex((p)=>{
        return p.tid == tid;
    })
    result = {};
    result.mentorName = mentors[index].name;
    console.log(mentors[index].studentids);
    result.studentids = [];
    mentors[index].studentids.forEach(studentid => {
        sindex = students.findIndex((s)=>{
            return s.sid == studentid;
        })
        result.studentids.push(students[sindex].sid);
    });
    res.status(200).json(result);
})

app.put('/put/mentor/:tid',(req,res)=>
{
    tid = req.params.tid;
    index = mentors.findIndex((p)=>{
        return p.tid == tid;
    });
    sids = req.body;
    sids.forEach(sid => {
        mentors[index].studentids.push(sid);
        sindex = students.findIndex((s)=>{
            return s.sid == sid;
        })
        students[sindex].hasMentor = true;
        students[sindex].tid = mentors[index].tid;        
    });
    res.status(200).json({"content":"Success"});
})

app.get('/put/mentor/:tid',(req,res)=>{
    tid = req.params.tid;
    index = mentors.findIndex((p)=>{
        return p.tid == tid;
    });
    availableStudents = [];
    students.forEach(student=>{
        if(!student.hasMentor)
        {
            availableStudents.push({"name":student.name,"sid":student.sid});
        }
    })
    res.status(200).json(availableStudents);
})

app.put('/put/student/:sid',(req,res)=>{
    console.log('entered');
    sid = req.params.sid;
    index = students.findIndex((s)=>{
        return s.sid == sid;
    });
    tid = req.body.tid;
    if(students[index].hasMentor == true)
    {
        currtid = students[index].tid;
        currindex = mentors.findIndex((p)=>{
            return p.tid == currtid;
        })
        delteindex = mentors[currindex].studentids.findIndex((msid)=>{
            return msid==sid;
        })
        mentors[currindex].studentids.splice(delteindex,1);
    }
    students[index].hasMentor = true;
    students[index].tid = tid;
    tindex = mentors.findIndex((t)=>{
        return t.tid ==tid;
    });
    mentors[tindex].studentids.push(parseInt(sid));
    res.status(200).json({"content":"Success"});
})