// authenticationService.js
const db = require("../commons/typeorm");
const LOGGER = require('../middleware/logger');

class RankService {
    //-----------------------------------------------------------
    //-- create Rank game board save 
    //-----------------------------------------------------------
    async createRank(rankData) {
        try {
            const rankRepository = db.connection.getRepository('RankRecord');
            const newRank = rankRepository.create(rankData);
            return await rankRepository.save(newRank);
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    //-----------------------------------------------------------
    //-- update Rank game board save 
    //-----------------------------------------------------------
    async updateRankByUuid(uuid, updatedData) {
        try {
            const rankRepository = db.connection.getRepository('RankRecord');

            // ค้นหาข้อมูลโดยใช้ UUID
            const existingRank = await rankRepository.findOne({ where: { uuidAccount: uuid } });

            // ถ้าไม่พบข้อมูล
            if (!existingRank) {
                throw new Error('Rank not found');
            }
            // อัปเดตข้อมูลที่ต้องการ
            Object.assign(existingRank, updatedData);

            // บันทึกการเปลี่ยนแปลง
            await rankRepository.save(existingRank);

            return existingRank;
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    //-----------------------------------------------------------
    //-- get Rank game board save Rank
    //-----------------------------------------------------------
    async getRankByUuidAccount(uuidAccount) {
        try {
            return await db.connection.getRepository('RankRecord')
                .createQueryBuilder()
                .where('active = true and uuid_account = :uuidAccount', { uuidAccount })
                .getOne();
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    //-----------------------------------------------------------
    //-- get Top 3 Rank Scores
    //-----------------------------------------------------------
    async getTop3RankScores() {
        try {
            return await db.connection.query(`
            SELECT rank.rank_score, account.acc_firstname, account.acc_picture
            FROM rank_record AS rank
            INNER JOIN cms_account AS account ON rank.uuid_account = account.uuid_account
            ORDER BY rank.rank_score DESC
            LIMIT 3
        `);
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

    //-----------------------------------------------------------
    //-- get Table Rank Scores 
    //-----------------------------------------------------------
    async getTableRankScores(uuid) {
        try {
            const [beforeRankScores, afterRankScores] = await Promise.all([
                db.connection.query(`
                    SELECT rank.rank_score, account.acc_firstname, account.acc_picture
                    FROM rank_record AS rank
                    INNER JOIN cms_account AS account ON rank.uuid_account = account.uuid_account
                    WHERE rank.rank_score > (SELECT rank_score FROM rank_record WHERE uuid_account = $1 LIMIT 1)
                    ORDER BY rank.rank_score DESC
                    LIMIT 3
                `, [uuid]),
                db.connection.query(`
                    SELECT rank.rank_score, account.acc_firstname, account.acc_picture
                    FROM rank_record AS rank
                    INNER JOIN cms_account AS account ON rank.uuid_account = account.uuid_account
                    WHERE rank.rank_score < (SELECT rank_score FROM rank_record WHERE uuid_account = $1 LIMIT 1)
                    ORDER BY rank.rank_score DESC 
                    LIMIT 3
                `, [uuid])
            ]);
            
            // ค้นหาข้อมูลของ uuid ของคุณและคะแนนของคุณ
            const myRank = await db.connection.query(`
                SELECT rank.rank_score, account.acc_firstname, account.acc_picture
                FROM rank_record AS rank
                INNER JOIN cms_account AS account ON rank.uuid_account = account.uuid_account
                WHERE rank.uuid_account = $1
            `, [uuid]);

            const combinedRankScores = [...beforeRankScores, ...myRank, ...afterRankScores];
            return combinedRankScores;
        } catch (error) {
            LOGGER.error(error);
            throw new Error(error?.message);
        }
    }

}

module.exports = { RankService: new RankService() };
