import React, {Component, useEffect, useState} from 'react';
import Box from "@material-ui/core/Box";
import withStyles from "@material-ui/core/styles/withStyles";
import {PropTypes} from 'prop-types';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Card} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import FlagIcon from "@material-ui/icons/Flag";
import InfoIcon from "@material-ui/icons/Info";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import IconButton from "@material-ui/core/IconButton";
import {red} from "@material-ui/core/colors";
import clsx from "clsx";
import axios from 'axios';
import StudentDialog from "../presentational/StudentDialog.jsx";

const LiveCard = (props) => {
    const [data, setData] = useState(props.data);
    const handleFlag = () => {
        const newFlagState = !data.flag;
        //how tf do i flag??
        //axios.post('/v1/transactions/')
        setData({...data, flag: newFlagState});
    };
    const useStyles = makeStyles(theme => ({
        card: {
            maxWidth: 400,
            margin: theme.spacing(1),
        },
        flaggedCard: { //listen i know this is ugly af don't judge me, i just want to finish this damn project
            color: theme.palette.getContrastText(red[500]),
            backgroundColor: red[600]
        },
        flaggableButton: {
            color: theme.palette.getContrastText(red[500]),
            backgroundColor: red[600],
            '&:hover': {
                backgroundColor: red[800]
            }
        },
        profile: {
            height: 500,
        },
        secondaryAction: {
            marginLeft: 'auto',
        },
        rightIcon: {
            marginLeft: theme.spacing(1),
        }
    }));
    const classes = useStyles();
    return (
        <Card className={clsx(classes.card, {[classes.flaggedCard]: data.flag})}>
            <CardHeader
                title={data.student.name}
                subheader={data.student.student_id}
                action={
                    <IconButton onClick={()=>props.setStudentDialog(data.student)}>
                        <InfoIcon/>
                    </IconButton>
                }
            />
            <CardMedia image={"/static/img/" + data.student.pathToImage} className={classes.profile} />
            <CardActions>
                <Button onClick={handleFlag} variant="contained" className={clsx(classes.secondaryAction,{[classes.flaggableButton]: !data.flag})}>
                    {!data.flag ? "Flag" : "Unflag"}
                    {!data.flag ? <FlagIcon className={classes.rightIcon}/> : <ThumbUpIcon className={classes.rightIcon}/>}
                </Button>
            </CardActions>
        </Card>
    );
};

const LiveFeed = (props) => {
    return (
        <Box>
            {props.feed.map(item=><LiveCard key={item.idx} data={item} {...props} />)}
        </Box>
    );
};

const styles = theme => ({
    container: {
        height: '100%'
    },
    feed: {
        height: '100%'
    }
});

class LiveView extends Component {
    constructor(props) {
        super(props);
        this.classes = this.props.classes;
        this.state = {
            data: [...new Array(6)].map(i=>[]),
            active: [true, true, true, true, true, true],
            selectedStudent: null,
        };
        this.uniqueKey = 0;
        this.setStudentDialog = (student) => {
            this.setState((state, props) => {
                return {
                    selectedStudent: student === undefined ? null : student,
                }
            });
        };
        this.closeStudentDialog = () => {
            this.setStudentDialog(null);
        };
    }
    componentDidMount() {
        this.socket = new WebSocket('ws://' + window.location.host + '/v1/guard/live');
        this.socket.addEventListener('open', function() {
            console.log('socket opened');
        });
        this.socket.addEventListener('message', function(event) {
            const msg = JSON.parse(event.data);
            console.log(msg);
	    msg.idx = ++this.uniqueKey;
            msg.kiosk_id = parseInt(msg.kiosk_id);
	    if (msg.student === null) {
	        msg.student = {
		    name: "Invalid Student",
		    student_id: msg.entered_id,
		    pathToImage: 'bad_profile.jpg',
		    privilege_granted: false
		}
	    }
            this.setState((prevState) => {
                let data = prevState.data;
                data[msg.kiosk_id] = [msg, ...data[msg.kiosk_id]];
                return {
                    data: data
                };
            });
            console.log(this.state);
        }.bind(this));
    }

    render() {
        return (
            <React.Fragment>
            <Box className={this.classes.container} display="flex" flexDirection="row">
                {
                    this.state.active
                        .map((i,j,k)=>i?j:i) //set to index if active, else keep as inactive
                        .filter(i=>i!==false) //filter out inactive, leaving an array of kiosk ids
                        .map(i =>
                            <Box className={ this.classes.feed } key={i} flexGrow={ 1 }>
                                <LiveFeed setStudentDialog={this.setStudentDialog} kiosk={i} feed={this.state.data[i]}/>
                            </Box>
                        )
                }
            </Box>
            <StudentDialog  onClose={this.closeStudentDialog} open={this.state.selectedStudent !== null} student={this.state.selectedStudent}/>
            </React.Fragment>
        );
    }
    componentWillUnmount() {
        if ('socket' in this) {
            this.socket.close();
            delete this.socket;
        }
    }
}

LiveView.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LiveView);
