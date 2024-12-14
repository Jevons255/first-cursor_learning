# -*- coding: utf-8 -*-
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Optional
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 添加一个测试路由
@app.get("/test")
async def test():
    return {"message": "API is working"}

# 数据模型
class PersonalityData(BaseModel):
    extroversion: float
    agreeableness: float
    conscientiousness: float
    emotionalStability: float
    openness: float

class LifestyleData(BaseModel):
    wakingTime: str
    dietaryPreference: List[str]
    livingHabits: List[str]

class ValuesData(BaseModel):
    marriage: str
    children: str
    careerImportance: float

class PersonData(BaseModel):
    name: str
    age: int
    gender: str
    education: str
    occupation: str
    personality: PersonalityData
    lifestyle: LifestyleData
    values: ValuesData
    interests: List[str]
    relationshipHistory: str
    expectations: str

class MatchRequest(BaseModel):
    person1: PersonData
    person2: PersonData

# 匹配算法
def calculate_personality_match(p1: PersonalityData, p2: PersonalityData) -> dict:
    # 将性格特征转换为向量
    v1 = np.array([[p1.extroversion, p1.agreeableness, p1.conscientiousness, 
                    p1.emotionalStability, p1.openness]])
    v2 = np.array([[p2.extroversion, p2.agreeableness, p2.conscientiousness, 
                    p2.emotionalStability, p2.openness]])
    
    # 计算余弦相似度
    similarity = cosine_similarity(v1, v2)[0][0]
    score = int(similarity * 100)
    
    return {
        "score": score,
        "analysis": f"你们的性格特征{'互补' if score > 80 else '有一定差异'}。",
        "strengths": [
            "性格互补" if score > 80 else "性格相似",
            "情绪稳定度匹配" if abs(p1.emotionalStability - p2.emotionalStability) < 2 else "需要在情绪管理上互相理解",
            "沟通方式相近" if abs(p1.extroversion - p2.extroversion) < 2 else "需要适应对方的沟通方式"
        ],
        "suggestions": "建议在日常交流中多表达感受，增进彼此理解。"
    }

def calculate_values_match(v1: ValuesData, v2: ValuesData) -> dict:
    score = 0
    # 计算婚姻观匹配度
    if v1.marriage == v2.marriage:
        score += 40
    elif abs(["traditional", "modern", "open"].index(v1.marriage) - 
             ["traditional", "modern", "open"].index(v2.marriage)) == 1:
        score += 20
    
    # 计算子女计划匹配度
    if v1.children == v2.children:
        score += 40
    
    # 计算事业重要性匹配度
    career_diff = abs(v1.careerImportance - v2.careerImportance)
    score += max(0, 20 - career_diff * 2)
    
    return {
        "score": score,
        "analysis": f"在核心价值观上你们{'非常契合' if score > 80 else '有一定差异'}。",
        "strengths": [
            "婚姻观一致" if v1.marriage == v2.marriage else "婚姻观需要调和",
            "对子女计划看法一致" if v1.children == v2.children else "需要就子女问题多沟通",
            "事业规划相似" if career_diff < 2 else "需要平衡事业与家庭"
        ],
        "suggestions": "建议多交流未来规划，找到平衡点。"
    }

def calculate_lifestyle_match(l1: LifestyleData, l2: LifestyleData) -> dict:
    score = 0
    # 计算作息时间匹配度
    if l1.wakingTime == l2.wakingTime:
        score += 30
    elif abs(["early", "normal", "late"].index(l1.wakingTime) - 
             ["early", "normal", "late"].index(l2.wakingTime)) == 1:
        score += 15
    
    # 计算饮食习惯匹配度
    common_diet = set(l1.dietaryPreference) & set(l2.dietaryPreference)
    score += len(common_diet) * 10
    
    # 计算生活方式匹配度
    common_habits = set(l1.livingHabits) & set(l2.livingHabits)
    score += len(common_habits) * 5
    
    return {
        "score": min(100, score),
        "analysis": f"生活习惯上你们{'比较合拍' if score > 70 else '需要相互适应'}。",
        "strengths": [
            "作息时间匹配" if l1.wakingTime == l2.wakingTime else "作息时间有差异",
            f"有{len(common_diet)}个共同的饮食偏好",
            f"有{len(common_habits)}个共同的生活习惯"
        ],
        "suggestions": "建议相互体谅，在日常生活中做适当调整。"
    }

def calculate_interests_match(i1: List[str], i2: List[str]) -> dict:
    common_interests = set(i1) & set(i2)
    score = min(100, len(common_interests) * 20)
    
    return {
        "score": score,
        "analysis": f"你们有{len(common_interests)}个共同的兴趣爱好。",
        "strengths": [
            f"共同喜欢{interest}" for interest in common_interests
        ],
        "suggestions": "可以多安排共同兴趣相关的活动。"
    }

@app.post("/predict")
async def predict_match(request: MatchRequest):
    try:
        print("Received request data:", request.dict())
        # 计算各维度匹配度
        personality_match = calculate_personality_match(
            request.person1.personality, 
            request.person2.personality
        )
        values_match = calculate_values_match(
            request.person1.values,
            request.person2.values
        )
        lifestyle_match = calculate_lifestyle_match(
            request.person1.lifestyle,
            request.person2.lifestyle
        )
        interests_match = calculate_interests_match(
            request.person1.interests,
            request.person2.interests
        )
        
        # 计算总分
        total_score = int((
            personality_match["score"] * 0.3 +
            values_match["score"] * 0.3 +
            lifestyle_match["score"] * 0.2 +
            interests_match["score"] * 0.2
        ))
        
        # 确定匹配程度
        if total_score >= 85:
            compatibility = "非常高"
        elif total_score >= 70:
            compatibility = "较高"
        elif total_score >= 60:
            compatibility = "一般"
        else:
            compatibility = "较低"
        
        return {
            "score": total_score,
            "compatibility": compatibility,
            "details": {
                "personality": personality_match,
                "values": values_match,
                "lifestyle": lifestyle_match,
                "interests": interests_match
            },
            "overallSuggestions": [
                "多创造共处时光，培养更多共同话题",
                "保持开放和诚实的沟通态度",
                "尊重彼此的个人空间和习惯",
                "共同规划未来，制定可行的目标",
                "在矛盾出现时及时沟通，互相理解"
            ]
        }
    except Exception as e:
        print("Error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    """
    根路由处理函数
    返回: API欢迎信息
    """
    return {"message": "AI Love Match API"}