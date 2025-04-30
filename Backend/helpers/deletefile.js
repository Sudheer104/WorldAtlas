const fs = require('fs').promises;
const path = require('path');

const deleteFile = async(filePath)=>{
    try {
    
        await fs.unlink(filePath); //Here unlink means file will delete or unlink from profile
        console.log("File deleted successfully!");
    
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {deleteFile};