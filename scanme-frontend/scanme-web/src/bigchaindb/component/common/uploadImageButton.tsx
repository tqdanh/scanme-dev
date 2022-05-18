import * as React from 'react';
import {Button, FormControl, Typography} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
export class UploadImageButton extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            imgFile: this.props.imgFile
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            imgFile: nextProps.imgFile,
        };
    }
    isProductImages(name: string) {
        return name === 'adImg' || name === 'unitImg' || name === 'introImg' || name === 'ingredientImg';
    }
    render()  {
        const {config, handleUploadImage, handleDeleteImage, nameFile} = this.props;
        const {imgFile} = this.state;
        return <div style={{width: 128, display: 'flex', alignItems: 'center', margin: '0 16px'}}>
            {imgFile && imgFile.length > 0 && <div style={{textAlign: 'center'}}>
                {/*<img className='provider-ad-uploaded-image' style={{borderRadius: 2, marginBottom: 8, display: 'block', width: 128, height: 100}}*/}
                {/*     src={`${config.imageURL}${imgFile[0].name}`}*/}
                {/*     alt='uploaded_image'/>*/}
                <Typography style={{width: 128, textOverflow: 'ellipsis', overflow: 'hidden'}}>{imgFile[0].name} <DeleteIcon style={{display: 'inline'}} onClick={(e) => this.isProductImages(nameFile) ? handleDeleteImage() :  handleDeleteImage(e)}/></Typography>
            </div>}
                <label htmlFor={nameFile} style={{marginBottom: 8}}>
                    <Button style={{width: 160}} variant='contained' size='small' component='span'>
                        <CloudUploadIcon/> &nbsp; Tải hình lên
                    </Button>
                </label>
                <input
                    id={nameFile} /* remember id is different for file uploaders is important*/
                    name={nameFile}
                    accept='image/*'
                    style={{display: 'none', marginBottom: 8}}
                    type='file'
                    onChange={handleUploadImage}
                />
            </div>;
    }
}
