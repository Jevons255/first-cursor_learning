import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Typography,
  Box,
  Rating,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Slider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { pink } from '@mui/material/colors';
import ReactECharts from 'echarts-for-react';
import TimelineIcon from '@mui/icons-material/Timeline';

const API_URL = process.env.REACT_APP_API_URL;

const getRadarOption = (matchResult) => {
  return {
    title: {
      text: '匹配度分析雷达图',
      textStyle: {
        color: '#d81b60',
        fontSize: 16
      }
    },
    radar: {
      indicator: [
        { name: '性格匹配', max: 100 },
        { name: '价值观匹配', max: 100 },
        { name: '生活习惯', max: 100 },
        { name: '兴趣爱好', max: 100 }
      ],
      shape: 'circle',
      splitNumber: 5,
      axisName: {
        color: '#666'
      },
      splitLine: {
        lineStyle: {
          color: [
            'rgba(238, 197, 102, 0.1)',
            'rgba(238, 197, 102, 0.2)',
            'rgba(238, 197, 102, 0.4)',
            'rgba(238, 197, 102, 0.6)',
            'rgba(238, 197, 102, 0.8)',
            'rgba(238, 197, 102, 1)'
          ].reverse()
        }
      },
      splitArea: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(238, 197, 102, 0.5)'
        }
      }
    },
    series: [{
      name: '匹配度分析',
      type: 'radar',
      data: [{
        value: [
          matchResult.details.personality.score,
          matchResult.details.values.score,
          matchResult.details.lifestyle.score,
          matchResult.details.interests.score
        ],
        name: '匹配度',
        areaStyle: {
          color: 'rgba(255, 182, 193, 0.4)'
        },
        lineStyle: {
          color: '#d81b60'
        },
        itemStyle: {
          color: '#d81b60'
        }
      }]
    }]
  };
};

const getDetailedAnalysis = (matchResult) => {
  return {
    personalityAnalysis: {
      title: '性格匹配分析',
      items: [
        { label: '外向性互补度', value: calculateCompatibility(matchResult.details.personality.extroversion) },
        { label: '情绪稳定性', value: calculateCompatibility(matchResult.details.personality.emotionalStability) },
        { label: '沟通方式', value: calculateCompatibility(matchResult.details.personality.communication) }
      ]
    },
    lifestyleAnalysis: {
      title: '生活习惯分析',
      items: [
        { label: '作息规律', value: matchResult.details.lifestyle.routine },
        { label: '饮食习惯', value: matchResult.details.lifestyle.diet },
        { label: '生活节奏', value: matchResult.details.lifestyle.pace }
      ]
    },
    futureAnalysis: {
      title: '未来发展预测',
      items: [
        { label: '共同目标', value: matchResult.details.values.goals },
        { label: '价值观契合', value: matchResult.details.values.beliefs },
        { label: '发展潜力', value: matchResult.details.potential }
      ]
    }
  };
};

const getChartOptions = (matchResult) => ({
  radar: {
    // 现有的雷达图配置
  },
  bar: {
    // 添加条形图
    title: { text: '各维度详细得分' },
    xAxis: { type: 'category', data: ['性格', '价值观', '生活习惯', '兴趣'] },
    yAxis: { type: 'value' },
    series: [{
      data: [
        matchResult.details.personality.score,
        matchResult.details.values.score,
        matchResult.details.lifestyle.score,
        matchResult.details.interests.score
      ],
      type: 'bar'
    }]
  },
  pie: {
    // 添加饼图
    title: { text: '匹配度构成' },
    series: [{
      type: 'pie',
      data: [
        { value: 30, name: '性格特征' },
        { value: 30, name: '价值观念' },
        { value: 20, name: '生活习惯' },
        { value: 20, name: '兴趣爱好' }
      ]
    }]
  }
});

// 添加交互式分析组件
const InteractiveAnalysis = ({ matchResult }) => {
  const [selectedDimension, setSelectedDimension] = useState('personality');
  
  return (
    <Box>
      <Tabs value={selectedDimension} onChange={(e, v) => setSelectedDimension(v)}>
        <Tab label="性格分析" value="personality" />
        <Tab label="价值观分析" value="values" />
        <Tab label="生活习惯" value="lifestyle" />
        <Tab label="兴趣爱好" value="interests" />
      </Tabs>
      
      <Box sx={{ mt: 2 }}>
        {/* 详细分析内容 */}
        <DetailedAnalysisContent dimension={selectedDimension} data={matchResult} />
      </Box>
    </Box>
  );
};

// 添加具体的改进建议组件
const ImprovementSuggestions = ({ matchResult }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        关系提升建议
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="subtitle1" color="primary">
              短期建议（1-3个月）
            </Typography>
            <List>
              {matchResult.shortTermSuggestions.map((suggestion, index) => (
                <ListItem key={index}>
                  <ListItemIcon><TimelineIcon /></ListItemIcon>
                  <ListItemText primary={suggestion} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="subtitle1" color="primary">
              中期建议（3-6个月）
            </Typography>
            {/* 中期建议内容 */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="subtitle1" color="primary">
              长期建议（6个月以上）
            </Typography>
            {/* 长期建议内容 */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// 添加风险提示组件
const RiskAnalysis = ({ matchResult }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom color="warning.main">
        需要注意的方面
      </Typography>
      <Alert severity="warning" sx={{ mb: 2 }}>
        以下分析仅供参考，真实关系的发展还需要双方共同努力。
      </Alert>
      <Grid container spacing={2}>
        {matchResult.riskFactors.map((factor, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle1" color="warning.main">
                {factor.title}
              </Typography>
              <Typography variant="body2">
                {factor.description}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                建议：{factor.suggestion}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const initialPersonState = {
    name: '',
    age: '',
    gender: '',
    // 基本信息
    birthDate: '',
    education: '',
    occupation: '',
    // 性格特征
    personality: {
      extroversion: 5,
      agreeableness: 5,
      conscientiousness: 5,
      emotionalStability: 5,
      openness: 5
    },
    // 生活习惯
    lifestyle: {
      wakingTime: '',
      sleepingTime: '',
      dietaryPreference: '',
      exercise: ''
    },
    // 价值观
    values: {
      marriage: '',
      children: '',
      career: '',
      finance: ''
    },
    // 兴趣爱好
    interests: [],
    // 感情经历
    relationshipHistory: '',
    expectations: ''
  };

  const [formData, setFormData] = useState({
    person1: { ...initialPersonState },
    person2: { ...initialPersonState }  // 使用相同的初始状态
  });

  const [matchResult, setMatchResult] = useState(null);

  const steps = ['基本信息', '性格测评', '生活习惯', '价值观', '兴趣爱好', '感情期望'];

  const personalityTraits = [
    { name: 'extroversion', label: '外向性', description: '社交活跃程度' },
    { name: 'agreeableness', label: '亲和性', description: '与他人相处的和谐程度' },
    { name: 'conscientiousness', label: '尽责性', description: '做事的认真程度' },
    { name: 'emotionalStability', label: '情绪稳定性', description: '情绪控制能力' },
    { name: 'openness', label: '开放性', description: '接受新事物的程度' }
  ];

  const interestCategories = [
    '运动健身', '阅读', '音乐', '电影', '旅行', '美食', 
    '摄影', '游戏', '艺术', '手工', '园艺', '宠物',
    '科技', '时尚', '收藏', '户外活动'
  ];

  const ageOptions = Array.from({ length: 63 }, (_, i) => i + 18); // 18-80岁

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Sending request to:', `${API_URL}/predict`);
      console.log('Request data:', formData);
      
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',  // 明确指定cors模式
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '预测失败，请稍后重试');
      }
      
      const result = await response.json();
      console.log('Response:', result);
      setMatchResult(result);
    } catch (error) {
      console.error('Error details:', error);
      setError(error.message || '预测过程中出现错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={4}>
            {/* 你的基本信息输入 */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ 
                p: 3, 
                background: 'linear-gradient(to bottom right, #ffe6e6, #ffffff)',
                borderRadius: '15px'
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: pink[700] }}>
                  <FavoriteIcon sx={{ mr: 1 }} />
                  你的信息
                </Typography>
                <TextField
                  fullWidth
                  label="姓名"
                  margin="normal"
                  value={formData.person1.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    person1: { ...formData.person1, name: e.target.value }
                  })}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>年龄</InputLabel>
                  <Select
                    value={formData.person1.age}
                    onChange={(e) => setFormData({
                      ...formData,
                      person1: { ...formData.person1, age: e.target.value }
                    })}
                  >
                    {ageOptions.map((age) => (
                      <MenuItem key={age} value={age}>
                        {age}岁
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>性别</InputLabel>
                  <Select
                    value={formData.person1.gender}
                    onChange={(e) => setFormData({
                      ...formData,
                      person1: { ...formData.person1, gender: e.target.value }
                    })}
                  >
                    <MenuItem value="male">男</MenuItem>
                    <MenuItem value="female">女</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="职业"
                  margin="normal"
                  value={formData.person1.occupation}
                  onChange={(e) => setFormData({
                    ...formData,
                    person1: { ...formData.person1, occupation: e.target.value }
                  })}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>学历</InputLabel>
                  <Select
                    value={formData.person1.education}
                    onChange={(e) => setFormData({
                      ...formData,
                      person1: { ...formData.person1, education: e.target.value }
                    })}
                  >
                    <MenuItem value="highSchool">高中</MenuItem>
                    <MenuItem value="college">大专</MenuItem>
                    <MenuItem value="bachelor">本科</MenuItem>
                    <MenuItem value="master">硕士</MenuItem>
                    <MenuItem value="doctor">博士</MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>

            {/* TA的基本信息输����� */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ 
                p: 3, 
                background: 'linear-gradient(to bottom right, #e6f2ff, #ffffff)',
                borderRadius: '15px'
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#3f51b5' }}>
                  <FavoriteIcon sx={{ mr: 1 }} />
                  TA的信息
                </Typography>
                <TextField
                  fullWidth
                  label="姓名"
                  margin="normal"
                  value={formData.person2.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    person2: { ...formData.person2, name: e.target.value }
                  })}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>年龄</InputLabel>
                  <Select
                    value={formData.person2.age}
                    onChange={(e) => setFormData({
                      ...formData,
                      person2: { ...formData.person2, age: e.target.value }
                    })}
                  >
                    {ageOptions.map((age) => (
                      <MenuItem key={age} value={age}>
                        {age}岁
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>性别</InputLabel>
                  <Select
                    value={formData.person2.gender}
                    onChange={(e) => setFormData({
                      ...formData,
                      person2: { ...formData.person2, gender: e.target.value }
                    })}
                  >
                    <MenuItem value="male">男</MenuItem>
                    <MenuItem value="female">女</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="职业"
                  margin="normal"
                  value={formData.person2.occupation}
                  onChange={(e) => setFormData({
                    ...formData,
                    person2: { ...formData.person2, occupation: e.target.value }
                  })}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>学历</InputLabel>
                  <Select
                    value={formData.person2.education}
                    onChange={(e) => setFormData({
                      ...formData,
                      person2: { ...formData.person2, education: e.target.value }
                    })}
                  >
                    <MenuItem value="highSchool">高中</MenuItem>
                    <MenuItem value="college">大专</MenuItem>
                    <MenuItem value="bachelor">本科</MenuItem>
                    <MenuItem value="master">硕士</MenuItem>
                    <MenuItem value="doctor">博士</MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={4}>
            {/* 你的性格测评 */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ 
                p: 3, 
                background: 'linear-gradient(to bottom right, #ffe6e6, #ffffff)',
                borderRadius: '15px' 
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: pink[700] }}>
                  <FavoriteIcon sx={{ mr: 1 }} />
                  你的性格特征
                </Typography>
                {personalityTraits.map((trait) => (
                  <Box key={trait.name} sx={{ my: 2 }}>
                    <Typography gutterBottom>
                      {trait.label}（{trait.description}）
                    </Typography>
                    <Slider
                      value={formData.person1.personality[trait.name]}
                      onChange={(e, newValue) => {
                        setFormData({
                          ...formData,
                          person1: {
                            ...formData.person1,
                            personality: {
                              ...formData.person1.personality,
                              [trait.name]: newValue
                            }
                          }
                        });
                      }}
                      min={1}
                      max={10}
                      marks
                      valueLabelDisplay="auto"
                    />
                  </Box>
                ))}
              </Paper>
            </Grid>

            {/* TA的性格测评 */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ 
                p: 3, 
                background: 'linear-gradient(to bottom right, #e6f2ff, #ffffff)',
                borderRadius: '15px' 
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#3f51b5' }}>
                  <FavoriteIcon sx={{ mr: 1 }} />
                  TA的性格特征
                </Typography>
                {personalityTraits.map((trait) => (
                  <Box key={trait.name} sx={{ my: 2 }}>
                    <Typography gutterBottom>
                      {trait.label}（{trait.description}）
                    </Typography>
                    <Slider
                      value={formData.person2.personality[trait.name]}
                      onChange={(e, newValue) => {
                        setFormData({
                          ...formData,
                          person2: {
                            ...formData.person2,
                            personality: {
                              ...formData.person2.personality,
                              [trait.name]: newValue
                            }
                          }
                        });
                      }}
                      min={1}
                      max={10}
                      marks
                      valueLabelDisplay="auto"
                    />
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>
        );

      case 2:  // 生活习惯
        return (
          <Grid container spacing={4}>
            {/* 你的生活习惯 */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ 
                p: 3, 
                background: 'linear-gradient(to bottom right, #ffe6e6, #ffffff)',
                borderRadius: '15px'
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: pink[700] }}>
                  <FavoriteIcon sx={{ mr: 1 }} />
                  你的生活习惯
                </Typography>
                <FormControl fullWidth margin="normal">
                  <InputLabel>作息时间</InputLabel>
                  <Select
                    value={formData.person1.lifestyle.wakingTime}
                    onChange={(e) => setFormData({
                      ...formData,
                      person1: {
                        ...formData.person1,
                        lifestyle: {
                          ...formData.person1.lifestyle,
                          wakingTime: e.target.value
                        }
                      }
                    })}
                  >
                    <MenuItem value="early">早起型(6点前)</MenuItem>
                    <MenuItem value="normal">正常型(6-8点)</MenuItem>
                    <MenuItem value="late">晚起型(8点后)</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>饮食习惯</InputLabel>
                  <Select
                    multiple
                    value={formData.person1.lifestyle.dietaryPreference || []}
                    onChange={(e) => setFormData({
                      ...formData,
                      person1: {
                        ...formData.person1,
                        lifestyle: {
                          ...formData.person1.lifestyle,
                          dietaryPreference: e.target.value
                        }
                      }
                    })}
                  >
                    <MenuItem value="vegetarian">素食主义</MenuItem>
                    <MenuItem value="meat">荤食为主</MenuItem>
                    <MenuItem value="balanced">荤素均衡</MenuItem>
                    <MenuItem value="healthy">健康饮食</MenuItem>
                    <MenuItem value="spicy">重口味</MenuItem>
                    <MenuItem value="light">清淡</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>生活方式</InputLabel>
                  <Select
                    multiple
                    value={formData.person1.lifestyle.livingHabits || []}
                    onChange={(e) => setFormData({
                      ...formData,
                      person1: {
                        ...formData.person1,
                        lifestyle: {
                          ...formData.person1.lifestyle,
                          livingHabits: e.target.value
                        }
                      }
                    })}
                  >
                    <MenuItem value="smoking">吸烟</MenuItem>
                    <MenuItem value="drinking">饮酒</MenuItem>
                    <MenuItem value="gaming">打游戏</MenuItem>
                    <MenuItem value="sports">运动健身</MenuItem>
                    <MenuItem value="reading">阅读</MenuItem>
                    <MenuItem value="travel">旅行</MenuItem>
                    <MenuItem value="shopping">购物</MenuItem>
                    <MenuItem value="saving">储蓄理财</MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>

            {/* TA的生活习惯 */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ 
                p: 3, 
                background: 'linear-gradient(to bottom right, #e6f2ff, #ffffff)',
                borderRadius: '15px'
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#3f51b5' }}>
                  <FavoriteIcon sx={{ mr: 1 }} />
                  TA的生活习惯
                </Typography>
                <FormControl fullWidth margin="normal">
                  <InputLabel>作息时间</InputLabel>
                  <Select
                    value={formData.person2.lifestyle.wakingTime}
                    onChange={(e) => setFormData({
                      ...formData,
                      person2: {
                        ...formData.person2,
                        lifestyle: {
                          ...formData.person2.lifestyle,
                          wakingTime: e.target.value
                        }
                      }
                    })}
                  >
                    <MenuItem value="early">早起型(6点前)</MenuItem>
                    <MenuItem value="normal">正常型(6-8点)</MenuItem>
                    <MenuItem value="late">晚起型(8点后)</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>饮食习惯</InputLabel>
                  <Select
                    multiple
                    value={formData.person2.lifestyle.dietaryPreference || []}
                    onChange={(e) => setFormData({
                      ...formData,
                      person2: {
                        ...formData.person2,
                        lifestyle: {
                          ...formData.person2.lifestyle,
                          dietaryPreference: e.target.value
                        }
                      }
                    })}
                  >
                    <MenuItem value="vegetarian">素食主义</MenuItem>
                    <MenuItem value="meat">荤食为主</MenuItem>
                    <MenuItem value="balanced">荤素均衡</MenuItem>
                    <MenuItem value="healthy">健康饮食</MenuItem>
                    <MenuItem value="spicy">重口味</MenuItem>
                    <MenuItem value="light">清淡</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>生活方式</InputLabel>
                  <Select
                    multiple
                    value={formData.person2.lifestyle.livingHabits || []}
                    onChange={(e) => setFormData({
                      ...formData,
                      person2: {
                        ...formData.person2,
                        lifestyle: {
                          ...formData.person2.lifestyle,
                          livingHabits: e.target.value
                        }
                      }
                    })}
                  >
                    <MenuItem value="smoking">吸烟</MenuItem>
                    <MenuItem value="drinking">饮酒</MenuItem>
                    <MenuItem value="gaming">打游戏</MenuItem>
                    <MenuItem value="sports">运动健身</MenuItem>
                    <MenuItem value="reading">阅读</MenuItem>
                    <MenuItem value="travel">旅行</MenuItem>
                    <MenuItem value="shopping">购物</MenuItem>
                    <MenuItem value="saving">储蓄理财</MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
          </Grid>
        );

      case 3:  // 价值观
        return (
          <Grid container spacing={4}>
            {/* 你的价值观 */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ 
                p: 3, 
                background: 'linear-gradient(to bottom right, #ffe6e6, #ffffff)',
                borderRadius: '15px'
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: pink[700] }}>
                  <FavoriteIcon sx={{ mr: 1 }} />
                  你的价值观
                </Typography>
                
                <FormControl component="fieldset" fullWidth margin="normal">
                  <Typography variant="subtitle1" gutterBottom>
                    婚姻观
                  </Typography>
                  <RadioGroup
                    value={formData.person1.values.marriage}
                    onChange={(e) => setFormData({
                      ...formData,
                      person1: {
                        ...formData.person1,
                        values: {
                          ...formData.person1.values,
                          marriage: e.target.value
                        }
                      }
                    })}
                  >
                    <FormControlLabel value="traditional" control={<Radio />} label="传统婚姻观" />
                    <FormControlLabel value="modern" control={<Radio />} label="现代婚姻观" />
                    <FormControlLabel value="open" control={<Radio />} label="开放婚姻观" />
                  </RadioGroup>
                </FormControl>

                <FormControl component="fieldset" fullWidth margin="normal">
                  <Typography variant="subtitle1" gutterBottom>
                    子女计划
                  </Typography>
                  <RadioGroup
                    value={formData.person1.values.children}
                    onChange={(e) => setFormData({
                      ...formData,
                      person1: {
                        ...formData.person1,
                        values: {
                          ...formData.person1.values,
                          children: e.target.value
                        }
                      }
                    })}
                  >
                    <FormControlLabel value="want" control={<Radio />} label="想要孩子" />
                    <FormControlLabel value="dontWant" control={<Radio />} label="不想要孩子" />
                    <FormControlLabel value="later" control={<Radio />} label="以后再说" />
                  </RadioGroup>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <Typography variant="subtitle1" gutterBottom>
                    事业重要性
                  </Typography>
                  <Slider
                    value={formData.person1.values.careerImportance || 5}
                    onChange={(e, newValue) => setFormData({
                      ...formData,
                      person1: {
                        ...formData.person1,
                        values: {
                          ...formData.person1.values,
                          careerImportance: newValue
                        }
                      }
                    })}
                    min={1}
                    max={10}
                    marks
                    valueLabelDisplay="auto"
                  />
                </FormControl>
              </Paper>
            </Grid>

            {/* TA的价值观 */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ 
                p: 3, 
                background: 'linear-gradient(to bottom right, #e6f2ff, #ffffff)',
                borderRadius: '15px'
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#3f51b5' }}>
                  <FavoriteIcon sx={{ mr: 1 }} />
                  TA的价值观
                </Typography>
                
                <FormControl component="fieldset" fullWidth margin="normal">
                  <Typography variant="subtitle1" gutterBottom>
                    婚姻观
                  </Typography>
                  <RadioGroup
                    value={formData.person2.values.marriage}
                    onChange={(e) => setFormData({
                      ...formData,
                      person2: {
                        ...formData.person2,
                        values: {
                          ...formData.person2.values,
                          marriage: e.target.value
                        }
                      }
                    })}
                  >
                    <FormControlLabel value="traditional" control={<Radio />} label="传统婚姻观" />
                    <FormControlLabel value="modern" control={<Radio />} label="现代婚姻观" />
                    <FormControlLabel value="open" control={<Radio />} label="开放婚姻观" />
                  </RadioGroup>
                </FormControl>

                <FormControl component="fieldset" fullWidth margin="normal">
                  <Typography variant="subtitle1" gutterBottom>
                    子女计划
                  </Typography>
                  <RadioGroup
                    value={formData.person2.values.children}
                    onChange={(e) => setFormData({
                      ...formData,
                      person2: {
                        ...formData.person2,
                        values: {
                          ...formData.person2.values,
                          children: e.target.value
                        }
                      }
                    })}
                  >
                    <FormControlLabel value="want" control={<Radio />} label="想要孩子" />
                    <FormControlLabel value="dontWant" control={<Radio />} label="不想要孩子" />
                    <FormControlLabel value="later" control={<Radio />} label="以后再说" />
                  </RadioGroup>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <Typography variant="subtitle1" gutterBottom>
                    事业重要性
                  </Typography>
                  <Slider
                    value={formData.person2.values.careerImportance || 5}
                    onChange={(e, newValue) => setFormData({
                      ...formData,
                      person2: {
                        ...formData.person2,
                        values: {
                          ...formData.person2.values,
                          careerImportance: newValue
                        }
                      }
                    })}
                    min={1}
                    max={10}
                    marks
                    valueLabelDisplay="auto"
                  />
                </FormControl>
              </Paper>
            </Grid>
          </Grid>
        );

      case 4:  // 兴趣爱好
        return (
          <Grid container spacing={4}>
            {/* 你的兴趣爱好 */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ 
                p: 3, 
                background: 'linear-gradient(to bottom right, #ffe6e6, #ffffff)',
                borderRadius: '15px'
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: pink[700] }}>
                  <FavoriteIcon sx={{ mr: 1 }} />
                  你的兴趣爱好
                </Typography>
                <FormControl fullWidth margin="normal">
                  <InputLabel>选择你的兴趣爱好（可多选）</InputLabel>
                  <Select
                    multiple
                    value={formData.person1.interests}
                    onChange={(e) => setFormData({
                      ...formData,
                      person1: {
                        ...formData.person1,
                        interests: e.target.value
                      }
                    })}
                  >
                    {interestCategories.map((interest) => (
                      <MenuItem key={interest} value={interest}>
                        {interest}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Paper>
            </Grid>

            {/* TA的兴趣爱好 */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ 
                p: 3, 
                background: 'linear-gradient(to bottom right, #e6f2ff, #ffffff)',
                borderRadius: '15px'
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#3f51b5' }}>
                  <FavoriteIcon sx={{ mr: 1 }} />
                  TA的兴趣爱好
                </Typography>
                <FormControl fullWidth margin="normal">
                  <InputLabel>选择TA的兴趣爱好（可多选）</InputLabel>
                  <Select
                    multiple
                    value={formData.person2.interests}
                    onChange={(e) => setFormData({
                      ...formData,
                      person2: {
                        ...formData.person2,
                        interests: e.target.value
                      }
                    })}
                  >
                    {interestCategories.map((interest) => (
                      <MenuItem key={interest} value={interest}>
                        {interest}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
          </Grid>
        );

      case 5:  // 感情期望
        return (
          <Grid container spacing={4}>
            {/* 你的感情期望 */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ 
                p: 3, 
                background: 'linear-gradient(to bottom right, #ffe6e6, #ffffff)',
                borderRadius: '15px'
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: pink[700] }}>
                  <FavoriteIcon sx={{ mr: 1 }} />
                  你的感情期望
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="感情经历"
                  margin="normal"
                  value={formData.person1.relationshipHistory}
                  onChange={(e) => setFormData({
                    ...formData,
                    person1: {
                      ...formData.person1,
                      relationshipHistory: e.target.value
                    }
                  })}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="对未来感情的期望"
                  margin="normal"
                  value={formData.person1.expectations}
                  onChange={(e) => setFormData({
                    ...formData,
                    person1: {
                      ...formData.person1,
                      expectations: e.target.value
                    }
                  })}
                />
              </Paper>
            </Grid>

            {/* TA的感情期望 */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ 
                p: 3, 
                background: 'linear-gradient(to bottom right, #e6f2ff, #ffffff)',
                borderRadius: '15px'
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#3f51b5' }}>
                  <FavoriteIcon sx={{ mr: 1 }} />
                  TA的感情期望
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="感情经历"
                  margin="normal"
                  value={formData.person2.relationshipHistory}
                  onChange={(e) => setFormData({
                    ...formData,
                    person2: {
                      ...formData.person2,
                      relationshipHistory: e.target.value
                    }
                  })}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="对未来感情的期望"
                  margin="normal"
                  value={formData.person2.expectations}
                  onChange={(e) => setFormData({
                    ...formData,
                    person2: {
                      ...formData.person2,
                      expectations: e.target.value
                    }
                  })}
                />
              </Paper>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff0f0 0%, #f0f4ff 100%)'
    }}>
      <header style={{
        backgroundColor: pink[100],
        minHeight: '20vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: pink[700],
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h3" component="h1" gutterBottom>
          💕 AI恋爱契合度预测 💕
        </Typography>
        <Typography variant="h6">
          发现你们之间的甜蜜契合
        </Typography>
      </header>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: '20px' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 4 }}>
            {renderStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              上一步
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                activeStep === steps.length - 1 ? '开始预测' : '下一步'
              )}
            </Button>
          </Box>
        </Paper>

        {/* 预测结果展示部分 */}
        {matchResult && (
          <Paper elevation={3} sx={{ 
            mt: 4, 
            p: 4, 
            borderRadius: '20px',
            background: 'linear-gradient(to right bottom, #fff5f5, #fff)'
          }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ color: pink[700] }}>
              💕 匹配结果 💕
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Rating 
                value={matchResult.score / 20} 
                readOnly 
                size="large"
                sx={{ fontSize: '3rem' }}
              />
            </Box>
            
            <Typography variant="h5" align="center" gutterBottom>
              总体契合度: {matchResult.score}%
            </Typography>
            
            <Typography variant="h6" align="center" gutterBottom>
              匹配程度: {matchResult.compatibility}
            </Typography>

            {/* 修改详细分析部分 */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                详细分析:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle1">
                      性格匹配度: {matchResult.details.personality.score}%
                    </Typography>
                    <Typography variant="body2">
                      {matchResult.details.personality.analysis}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle1">
                      价值观匹配度: {matchResult.details.values.score}%
                    </Typography>
                    <Typography variant="body2">
                      {matchResult.details.values.analysis}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle1">
                      生活习惯匹配度: {matchResult.details.lifestyle.score}%
                    </Typography>
                    <Typography variant="body2">
                      {matchResult.details.lifestyle.analysis}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle1">
                      兴趣爱好匹配度: {matchResult.details.interests.score}%
                    </Typography>
                    <Typography variant="body2">
                      {matchResult.details.interests.analysis}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* 优势和建议部分 */}
            <Box sx={{ mt: 4 }}>
              <Grid container spacing={3}>
                {Object.entries(matchResult.details).map(([key, detail]) => (
                  <Grid item xs={12} key={key}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        {key === 'personality' ? '性格匹配' :
                         key === 'values' ? '价值观匹配' :
                         key === 'lifestyle' ? '生活习惯' :
                         '兴趣爱好'}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        优势:
                      </Typography>
                      <List>
                        {detail.strengths.map((strength, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <FavoriteIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary={strength} />
                          </ListItem>
                        ))}
                      </List>
                      <Typography variant="subtitle1" gutterBottom>
                        建议:
                      </Typography>
                      <Typography variant="body1">
                        {detail.suggestions}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* 整体建议部分 */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                整体建议:
              </Typography>
              <List>
                {matchResult.overallSuggestions.map((suggestion, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={suggestion} />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* 雷达图和评分卡片部分保持不变 */}
          </Paper>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Container>
    </div>
  );
}

export default App; 