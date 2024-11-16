const Unit = require("../../models/unit");
const user = require("../../models/user");
const { GoogleGenerativeAI } = require("@google/generative-ai");

class dataController {
    uploadWords = async (req, res) => {
        try {
            const UnitData = await Unit.findById(req.body.idDoc);
            if (UnitData) {
                const words = UnitData.words || []; 
                const selectedWords = req.body.selectedWords || []; 
    
                UnitData.words = words.concat(selectedWords); 
                await UnitData.save();
                return res.status(200).json(UnitData); 
            } else {
                return res.status(404).json('Document not found!');
            }
        } catch (err) {
            console.error(err); 
            return res.status(500).json(err);
        }
    }
    
    getDocData = async (req, res) => {
        try{
            const UnitData = await Unit.findById(req.body.idDoc);
            if(UnitData){
                return res.status(200).json(UnitData);
            }else{
                return res.status(404).json('Document not found!');
            }
        }catch(err){
            return res.status(500).json(err);
        }
    }
    getUserData = async (req, res) => {
        try{
            const userData = await user.findById(req.body.userId);
            if(userData){
                const { password, ...userWithoutPassword } = userData.toObject(); 
                return res.status(200).json(userWithoutPassword);
            }else{
                return res.status(404).json('User not found!');
            }
        }catch(err){
            return res.status(500).json(err);
        }
    }

    uploadParagrap = async (req, res) => {
        console.log(req.body); 
        const userData = await user.findById(req.body.userID);
        const title = req.body.title;
        const paragraph = req.body.paragraph;
        if (!userData) {
            return res.status(404).json('User not found!');
        }
        try{
            const newUnit = new Unit({
                'title': title,
                'paragraph': paragraph
            });
            
            const unit = await newUnit.save();
            userData.units.push(unit._id);
            await userData.save();
            return res.status(200).json(unit);
        }catch(err){
            return res.status(500).json(err);
        }
    }

    processWord = async (req, res) => {
        let words = req.body.words;
        words = words.join(' ');

        try{
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });
            const prompt = `Hãy trả về từ nguyên mẫu, từ loại(n, v, adj, adv...), phiên âm, giải nghĩa bằng tiếng anh, nghĩa tiếng Việt, ví dụ đơn giản của các từ: ${words} dưới dạng JSON với các title tương ứng (word, pos, ipa, en_meaning, vn_meaning, example)`;
            const result = await model.generateContent(prompt);
            const rawText = result.response.candidates[0].content.parts[0].text;
            const jsonString = rawText.replace(/```json\n|```/g, ''); // Bỏ các dấu ```json và ```
            const jsonResult = JSON.parse(jsonString); // Chuyển chuỗi thành JSON
            
            return res.status(200).json(jsonResult);
        }catch(err){
            return res.status(500).json(err);
        }
        
    }
}

module.exports = new dataController;