import mongoose from 'mongoose';
import DeviceData from '../models/deviceDataModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// ...existing code...

const getGraphData = asyncHandler(async (req, res) => {
    const { deviceId } = req.params;
    const { duration = '24h', points = 24 } = req.query;

    // Calculate time range
    const endTime = new Date();
    const startTime = new Date();
    
    switch (duration) {
        case '1h':
            startTime.setHours(endTime.getHours() - 1);
            break;
        case '24h':
            startTime.setHours(endTime.getHours() - 24);
            break;
        case '7d':
            startTime.setDate(endTime.getDate() - 7);
            break;
        case '30d':
            startTime.setDate(endTime.getDate() - 30);
            break;
        default:
            startTime.setHours(endTime.getHours() - 24);
    }

    // Get data points with aggregation for even distribution
    const graphData = await DeviceData.aggregate([
        {
            $match: {
                device: new mongoose.Types.ObjectId(deviceId),
                createdAt: { $gte: startTime, $lte: endTime }
            }
        },
        { $sort: { createdAt: 1 } },
        {
            $group: {
                _id: {
                    $toDate: {
                        $subtract: [
                            { $toLong: "$createdAt" },
                            { $mod: [
                                { $subtract: [{ $toLong: "$createdAt" }, { $toLong: startTime }] },
                                Math.floor((endTime - startTime) / points)
                            ]}
                        ]
                    }
                },
                temperature: { $avg: "$temperature" },
                humidity: { $avg: "$humidity" }
            }
        },
        { $sort: { "_id": 1 } },
        {
            $project: {
                _id: 0,
                timestamp: "$_id",
                temperature: { $round: ["$temperature", 1] },
                humidity: { $round: ["$humidity", 1] }
            }
        }
    ]);

    if (!graphData.length) {
        res.status(404);
        throw new Error('No data available for graph');
    }

    res.status(200).json({
        data: graphData,
        metadata: {
            start: startTime,
            end: endTime,
            pointCount: graphData.length,
            deviceId
        }
    });
});

// Update the exports
export {
    // ...existing exports...
    getGraphData
};
